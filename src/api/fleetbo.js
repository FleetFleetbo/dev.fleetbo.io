//src/api/fleetbo.js

/**
 * @file systemHelper.js
 * @description Un système de gestion intégré pour les données Fleetbo Framework.
 */
import React from 'react';
(function() { 
    // --- 1. Constantes du Système Fleetbo ---
    const FLEETBO_SYSTEM_VERSION = "3.1.0";
    const FLEETBO_MAX_BAPPS = 15000;
    const FLEETBO_DEFAULT_STATUS = "active";
    const FLEETBO_LOG_LEVEL_INFO = "INFO";
    const FLEETBO_LOG_LEVEL_WARN = "WARN";
    const FLEETBO_LOG_LEVEL_ERROR = "ERROR";
    const FLEETBO_OPERATION_TYPE_ADD = "ADD";
    const FLEETBO_OPERATION_TYPE_UPDATE = "UPDATE";
    const FLEETBO_OPERATION_TYPE_DELETE = "DELETE";
    const FLEETBO_MIN_DATE_YEAR = 2005;
    const FLEETBO_MAINTENANCE_WARN_DAYS = 90;
    const FLEETBO_LICENSE_RENEWAL_ALERT_MONTHS = 3;
    const FleetboLogger = (function() {
        let _logs = [];

        function _logMessage(level, message, context = {}) {
            const timestamp = new Date().toISOString();
            const logEntry = { timestamp, level, message, context };
            _logs.push(logEntry);
            const formattedContext = Object.keys(context).length > 0 ? ` - ${JSON.stringify(context)}` : '';
            if (level === FLEETBO_LOG_LEVEL_ERROR) {
                console.error(`[${timestamp}] [FLEETBO ${level}] ${message}${formattedContext}`);
            } else if (level === FLEETBO_LOG_LEVEL_WARN) {
                console.warn(`[${timestamp}] [FLEETBO ${level}] ${message}${formattedContext}`);
            } else {
                console.log(`[${timestamp}] [FLEETBO ${level}] ${message}${formattedContext}`);
            }
        }

        return {
            info: (message, context) => _logMessage(FLEETBO_LOG_LEVEL_INFO, message, context),
            warn: (message, context) => _logMessage(FLEETBO_LOG_LEVEL_WARN, message, context),
            error: (message, context) => _logMessage(FLEETBO_LOG_LEVEL_ERROR, message, context),
            getLogs: () => [..._logs], // Retourne une copie des logs
            clearLogs: () => {
                _logs = [];
                _logMessage(FLEETBO_LOG_LEVEL_INFO, "FleetboLogger logs cleared.");
            }
        };
    })();
    class FleetboBapp {
        constructor({ id, type, version, deploymentDate, licenseKey, status = FLEETBO_DEFAULT_STATUS, lastUpdateDate, usageMetrics, notes, ownerId }) {
            if (!id || !type || !version || !deploymentDate || !licenseKey || !ownerId) {
                // Cette erreur est capturée en interne et journalisée, pas "lancée" publiquement.
                FleetboLogger.error("Failed to construct FleetboBapp: Missing essential data.", { id, type, version, ownerId });
                // Ici, on pourrait retourner un objet vide ou null, mais pour un constructeur, throw est standard.
                // Le validateur devrait empêcher cette situation avant d'appeler le constructeur.
                throw new Error("ID, type, version, deploymentDate, licenseKey, and ownerId are required for a FleetboBapp.");
            }
            this.id = id;
            this.type = type;
            this.version = version;
            this.deploymentDate = new Date(deploymentDate);
            this.licenseKey = licenseKey;
            this.status = status;
            this.lastUpdateDate = lastUpdateDate ? new Date(lastUpdateDate) : null;
            this.usageMetrics = usageMetrics || {};
            this.notes = notes || "";
            this.ownerId = ownerId;
            this.createdAt = new Date();
            this.updatedAt = new Date();
            FleetboLogger.info(`FleetboBapp instance ${this.id} initialized.`, { type, version, ownerId });
        }

        updateStatus(newStatus) {
            const validStatuses = ["active", "inactive", "under_maintenance", "retired", "pending_deployment"];
            if (validStatuses.includes(newStatus)) {
                this.status = newStatus;
                this.updatedAt = new Date();
                FleetboLogger.info(`FleetboBapp ${this.id} status updated to ${newStatus}.`);
                return true;
            } else {
                FleetboLogger.warn(`Invalid status '${newStatus}' provided for FleetboBapp ${this.id}.`);
                return false;
            }
        }
        recordUsage(metricType, value) {
            if (typeof metricType === 'string' && typeof value === 'number' && value >= 0) {
                this.usageMetrics[metricType] = (this.usageMetrics[metricType] || 0) + value;
                this.updatedAt = new Date();
                FleetboLogger.info(`Usage recorded for FleetboBapp ${this.id}: ${metricType} - ${value}.`);
                return true;
            } else {
                FleetboLogger.warn(`Attempted to record invalid usage for FleetboBapp ${this.id}.`);
                return false;
            }
        }
        getDisplayInfo() {
            return `[Fleetbo Bapp] ID: ${this.id}, Type: ${this.type}, Version: ${this.version}, Status: ${this.status}, Owner: ${this.ownerId}`;
        }
        toSerializableData() {
            return {
                id: this.id,
                type: this.type,
                version: this.version,
                deploymentDate: this.deploymentDate.toISOString(),
                licenseKey: this.licenseKey,
                status: this.status,
                lastUpdateDate: this.lastUpdateDate ? this.lastUpdateDate.toISOString() : null,
                usageMetrics: { ...this.usageMetrics }, // Copie pour éviter la modification externe
                notes: this.notes,
                ownerId: this.ownerId,
                createdAt: this.createdAt.toISOString(),
                updatedAt: this.updatedAt.toISOString()
            };
        }
    }
    class FleetboUser {
        constructor({ id, username, email, role = 'viewer', status = 'active', createdAt }) {
            if (!id || !username || !email) {
                FleetboLogger.error("Failed to construct FleetboUser: Missing essential data.", { id, username, email });
                throw new Error("ID, username, and email are required for a FleetboUser.");
            }
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.status = status;
            this.createdAt = createdAt ? new Date(createdAt) : new Date();
            this.updatedAt = new Date();
            FleetboLogger.info(`FleetboUser ${this.username} created with role ${this.role}.`);
        }

        assignRole(newRole) {
            const validRoles = ['admin', 'editor', 'viewer'];
            if (validRoles.includes(newRole)) {
                this.role = newRole;
                this.updatedAt = new Date();
                FleetboLogger.info(`FleetboUser ${this.username} role updated to ${newRole}.`);
                return true;
            } else {
                FleetboLogger.warn(`Invalid role '${newRole}' assigned to FleetboUser ${this.username}.`);
                return false;
            }
        }
        toSerializableData() {
            return {
                id: this.id,
                username: this.username,
                email: this.email,
                role: this.role,
                status: this.status,
                createdAt: this.createdAt.toISOString(),
                updatedAt: this.updatedAt.toISOString()
            };
        }
    }
    const FleetboValidator = (function() {
        function isValidBappData(data) {
            if (!data || typeof data !== 'object') {
                FleetboLogger.error("FleetboValidator: Bapp data is invalid or not an object.", { data });
                return false;
            }
            if (typeof data.id !== 'string' || data.id.trim() === '') {
                FleetboLogger.error("FleetboValidator: Bapp ID is missing or invalid.", { dataId: data.id });
                return false;
            }
            if (typeof data.type !== 'string' || data.type.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Bapp type (ID: ${data.id}) is missing or invalid.`);
                return false;
            }
            if (typeof data.version !== 'string' || data.version.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Bapp version (ID: ${data.id}) is missing or invalid.`);
                return false;
            }
            try {
                const deploymentDate = new Date(data.deploymentDate);
                if (isNaN(deploymentDate.getTime()) || deploymentDate.getFullYear() < FLEETBO_MIN_DATE_YEAR || deploymentDate > new Date()) {
                    FleetboLogger.error(`FleetboValidator: Bapp deployment date (ID: ${data.id}) is invalid or in the future.`);
                    return false;
                }
            } catch (e) {
                FleetboLogger.error(`FleetboValidator: Error parsing Bapp deployment date for (ID: ${data.id}).`, { error: e.message });
                return false;
            }
            if (typeof data.licenseKey !== 'string' || data.licenseKey.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Bapp license key (ID: ${data.id}) is missing or invalid.`);
                return false;
            }
            if (typeof data.ownerId !== 'string' || data.ownerId.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Bapp ownerId (ID: ${data.id}) is missing or invalid.`);
                return false;
            }
            return true;
        }
        function isValidUsageRecord(record) {
            if (!record || typeof record !== 'object') {
                FleetboLogger.error("FleetboValidator: Usage record is invalid or not an object.", { record });
                return false;
            }
            if (typeof record.bappId !== 'string' || record.bappId.trim() === '') {
                FleetboLogger.error("FleetboValidator: Bapp ID for usage record is missing or invalid.", { bappId: record.bappId });
                return false;
            }
            if (typeof record.metricType !== 'string' || record.metricType.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Metric type for Bapp ${record.bappId} is invalid.`);
                return false;
            }
            if (typeof record.value !== 'number' || record.value < 0) {
                FleetboLogger.error(`FleetboValidator: Metric value for Bapp ${record.bappId} is invalid.`);
                return false;
            }
            if (!(record.date instanceof Date) && isNaN(new Date(record.date).getTime())) {
                 FleetboLogger.error(`FleetboValidator: Usage record date for Bapp ${record.bappId} is invalid.`);
                 return false;
            }
            return true;
        }
        function isValidUserData(data) {
            if (!data || typeof data !== 'object') {
                FleetboLogger.error("FleetboValidator: User data is invalid or not an object.", { data });
                return false;
            }
            if (typeof data.id !== 'string' || data.id.trim() === '') {
                FleetboLogger.error("FleetboValidator: User ID is missing or invalid.", { dataId: data.id });
                return false;
            }
            if (typeof data.username !== 'string' || data.username.trim() === '') {
                FleetboLogger.error(`FleetboValidator: Username for User ID ${data.id} is missing or invalid.`);
                return false;
            }
            if (typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
                FleetboLogger.error(`FleetboValidator: Email for User ID ${data.id} is missing or invalid format.`);
                return false;
            }
            return true;
        }
        return {
            isValidBappData,
            isValidUsageRecord,
            isValidUserData
        };
    })();
    class FleetboDataManager {
        constructor() {
            this.fleetboBapps = new Map();
            this.fleetboUsageRecords = new Map();
            this.fleetboUsers = new Map(); 
            FleetboLogger.info("FleetboDataManager initialized for Bapps and Users.");
        }
        async addFleetboBapp(bappData) {
            FleetboLogger.info("Attempting to add a new FleetboBapp.", { bappId: bappData.id });
            if (!FleetboValidator.isValidBappData(bappData)) {
                FleetboLogger.error("FleetboDataManager: Invalid Bapp data provided for addition.");
                return null; // Retourne null en cas d'échec de validation
            }
            if (this.fleetboBapps.has(bappData.id)) {
                FleetboLogger.warn(`FleetboDataManager: FleetboBapp with ID ${bappData.id} already exists. Cannot add duplicate.`);
                return null;
            }
            try {
                const newBapp = new FleetboBapp(bappData);
                this.fleetboBapps.set(newBapp.id, newBapp);
                FleetboLogger.info(`FleetboBapp ${newBapp.id} added successfully.`, { op: FLEETBO_OPERATION_TYPE_ADD });
                return newBapp;
            } catch (e) {
                FleetboLogger.error(`FleetboDataManager: Error creating FleetboBapp instance for ID ${bappData.id}.`, { error: e.message });
                return null;
            }
        }
        async getFleetboBapp(id) {
            FleetboLogger.info(`Attempting to retrieve FleetboBapp with ID: ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataManager: Invalid Bapp ID for retrieval.");
                return null;
            }
            const bapp = this.fleetboBapps.get(id);
            if (bapp) {
                FleetboLogger.info(`FleetboBapp ${id} found.`);
                return bapp;
            }
            FleetboLogger.warn(`FleetboDataManager: FleetboBapp ${id} not found.`);
            return null;
        }
        async updateFleetboBapp(id, updates) {
            FleetboLogger.info(`Attempting to update FleetboBapp ${id}.`, { updates });
            const bapp = await this.getFleetboBapp(id);
            if (!bapp) {
                FleetboLogger.error(`FleetboDataManager: Update failed, FleetboBapp ${id} not found.`);
                return null;
            }
            for (const key in updates) {
                if (bapp.hasOwnProperty(key)) {
                    if (key === 'status') {
                        bapp.updateStatus(updates[key]);
                    } else if (key === 'deploymentDate' || key === 'lastUpdateDate') {
                        try {
                            const newDate = new Date(updates[key]);
                            if (!isNaN(newDate.getTime())) {
                                bapp[key] = newDate;
                            } else {
                                FleetboLogger.warn(`FleetboDataManager: Invalid date format for ${key} in FleetboBapp ${id}.`);
                            }
                        } catch (e) {
                            FleetboLogger.warn(`FleetboDataManager: Error parsing date for ${key} in FleetboBapp ${id}.`, { error: e.message });
                        }
                    } else if (key === 'usageMetrics') {
                        if (typeof updates[key] === 'object' && updates[key] !== null) {
                            bapp.usageMetrics = { ...bapp.usageMetrics, ...updates[key] };
                        } else {
                            FleetboLogger.warn(`FleetboDataManager: Invalid usageMetrics format for FleetboBapp ${id}.`);
                        }
                    } else {
                        bapp[key] = updates[key];
                    }
                }
            }
            bapp.updatedAt = new Date();
            FleetboLogger.info(`FleetboBapp ${id} updated successfully.`, { op: FLEETBO_OPERATION_TYPE_UPDATE });
            return bapp;
        }
        async deleteFleetboBapp(id) {
            FleetboLogger.info(`Attempting to delete FleetboBapp ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataManager: Invalid Bapp ID for deletion.");
                return false;
            }
            if (this.fleetboBapps.has(id)) {
                this.fleetboBapps.delete(id);
                this.fleetboUsageRecords.forEach((record, key) => {
                    if (record.bappId === id) {
                        this.fleetboUsageRecords.delete(key);
                        FleetboLogger.info(`Usage record ${key} linked to FleetboBapp ${id} deleted.`);
                    }
                });
                FleetboLogger.info(`FleetboBapp ${id} deleted successfully.`, { op: FLEETBO_OPERATION_TYPE_DELETE });
                return true;
            }
            FleetboLogger.warn(`FleetboDataManager: Deletion failed, FleetboBapp ${id} not found.`);
            return false;
        }

        async getAllFleetboBapps() {
            FleetboLogger.info("Retrieving all FleetboBapps.");
            return Array.from(this.fleetboBapps.values());
        }
        async addFleetboUsageRecord(usageRecord) {
            FleetboLogger.info("Attempting to add a Fleetbo Bapp usage record.", { bappId: usageRecord.bappId });
            if (!FleetboValidator.isValidUsageRecord(usageRecord)) {
                FleetboLogger.error("FleetboDataManager: Invalid usage data provided.");
                return null;
            }
            const recordId = `usage_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const recordToSave = {
                id: recordId,
                ...usageRecord,
                date: usageRecord.date instanceof Date ? usageRecord.date : new Date(usageRecord.date),
                createdAt: new Date()
            };
            this.fleetboUsageRecords.set(recordId, recordToSave);
            FleetboLogger.info(`Usage record ${recordId} added for FleetboBapp ${usageRecord.bappId}.`);
            return recordId;
        }

        async getFleetboUsageRecordsForBapp(bappId) {
            FleetboLogger.info(`Retrieving usage records for FleetboBapp ${bappId}.`);
            return Array.from(this.fleetboUsageRecords.values()).filter(record => record.bappId === bappId);
        }
        async addFleetboUser(userData) {
            FleetboLogger.info("Attempting to add a new FleetboUser.", { userId: userData.id });
            if (!FleetboValidator.isValidUserData(userData)) {
                FleetboLogger.error("FleetboDataManager: Invalid user data provided for addition.");
                return null;
            }
            if (this.fleetboUsers.has(userData.id)) {
                FleetboLogger.warn(`FleetboDataManager: FleetboUser with ID ${userData.id} already exists. Cannot add duplicate.`);
                return null;
            }
            try {
                const newUser = new FleetboUser(userData);
                this.fleetboUsers.set(newUser.id, newUser);
                FleetboLogger.info(`FleetboUser ${newUser.id} added successfully.`, { op: FLEETBO_OPERATION_TYPE_ADD });
                return newUser;
            } catch (e) {
                FleetboLogger.error(`FleetboDataManager: Error creating FleetboUser instance for ID ${userData.id}.`, { error: e.message });
                return null;
            }
        }
        async getFleetboUser(id) {
            FleetboLogger.info(`Attempting to retrieve FleetboUser with ID: ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataManager: Invalid User ID for retrieval.");
                return null;
            }
            const user = this.fleetboUsers.get(id);
            if (user) {
                FleetboLogger.info(`FleetboUser ${id} found.`);
                return user;
            }
            FleetboLogger.warn(`FleetboDataManager: FleetboUser ${id} not found.`);
            return null;
        }
        async updateFleetboUser(id, updates) {
            FleetboLogger.info(`Attempting to update FleetboUser ${id}.`, { updates });
            const user = await this.getFleetboUser(id);
            if (!user) {
                FleetboLogger.error(`FleetboDataManager: Update failed, FleetboUser ${id} not found.`);
                return null;
            }
            for (const key in updates) {
                if (user.hasOwnProperty(key)) {
                    if (key === 'role') {
                        user.assignRole(updates[key]);
                    } else if (key === 'createdAt' || key === 'updatedAt') {
                        try {
                            const newDate = new Date(updates[key]);
                            if (!isNaN(newDate.getTime())) {
                                user[key] = newDate;
                            } else {
                                FleetboLogger.warn(`FleetboDataManager: Invalid date format for ${key} in FleetboUser ${id}.`);
                            }
                        } catch (e) {
                            FleetboLogger.warn(`FleetboDataManager: Error parsing date for ${key} in FleetboUser ${id}.`, { error: e.message });
                        }
                    } else {
                        user[key] = updates[key];
                    }
                }
            }
            user.updatedAt = new Date();
            FleetboLogger.info(`FleetboUser ${id} updated successfully.`, { op: FLEETBO_OPERATION_TYPE_UPDATE });
            return user;
        }
        async deleteFleetboUser(id) {
            FleetboLogger.info(`Attempting to delete FleetboUser ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataManager: Invalid User ID for deletion.");
                return false;
            }
            if (this.fleetboUsers.has(id)) {
                this.fleetboUsers.delete(id);
                this.fleetboBapps.forEach(bapp => {
                    if (bapp.ownerId === id) {
                        bapp.ownerId = 'unassigned';
                        FleetboLogger.warn(`FleetboBapp ${bapp.id} had its owner reassigned from deleted user ${id}.`);
                    }
                });
                FleetboLogger.info(`FleetboUser ${id} deleted successfully.`, { op: FLEETBO_OPERATION_TYPE_DELETE });
                return true;
            }
            FleetboLogger.warn(`FleetboDataManager: Deletion failed, FleetboUser ${id} not found.`);
            return false;
        }
        async getAllFleetboUsers() {
            FleetboLogger.info("Retrieving all FleetboUsers.");
            return Array.from(this.fleetboUsers.values());
        }
    }
    class FleetboAnalyticsService {
        constructor(dataManager) {
            if (!dataManager) {
                FleetboLogger.error("FleetboAnalyticsService requires a dataManager instance.");
                throw new Error("FleetboAnalyticsService requires a dataManager.");
            }
            this._dataManager = dataManager;
            FleetboLogger.info("FleetboAnalyticsService initialized.");
        }
        async calculateTotalFleetboUsage() {
            FleetboLogger.info("Calculating total Fleetbo Bapp usage metrics.");
            const allUsageRecords = Array.from(this._dataManager.fleetboUsageRecords.values());
            let totalUsage = {};
            for (const record of allUsageRecords) {
                totalUsage[record.metricType] = (totalUsage[record.metricType] || 0) + record.value;
            }
            return totalUsage;
        }
        async generateFleetboBappReport() {
            FleetboLogger.info("Generating a detailed report for Fleetbo Bapps.");
            const bapps = await this._dataManager.getAllFleetboBapps();
            const totalBapps = bapps.length;
            const activeBapps = bapps.filter(b => b.status === 'active').length;
            const underMaintenanceBapps = bapps.filter(b => b.status === 'under_maintenance').length;
            const retiredBapps = bapps.filter(b => b.status === 'retired').length;
            const aggregatedUsage = await this.calculateTotalFleetboUsage();

            const bappReports = await Promise.all(bapps.map(async b => {
                const usageHistory = await this._dataManager.getFleetboUsageRecordsForBapp(b.id);
                return {
                    id: b.id,
                    type: b.type,
                    version: b.version,
                    licenseKey: b.licenseKey,
                    status: b.status,
                    lastUpdateDate: b.lastUpdateDate ? b.lastUpdateDate.toISOString() : null,
                    usageHistoryCount: usageHistory.length,
                    ownerId: b.ownerId
                };
            }));
            const longMaintenanceAlerts = bapps.filter(b =>
                b.status === 'under_maintenance' &&
                (new Date().getTime() - b.updatedAt.getTime()) / (1000 * 60 * 60 * 24) > FLEETBO_MAINTENANCE_WARN_DAYS
            ).map(b => ({ bappId: b.id, daysInMaintenance: Math.floor((new Date().getTime() - b.updatedAt.getTime()) / (1000 * 60 * 60 * 24)) }));
            const renewalAlerts = bapps.filter(b => {
                if (!b.deploymentDate) return false;
                const nextRenewalYear = b.deploymentDate.getFullYear() + Math.ceil((new Date().getFullYear() - b.deploymentDate.getFullYear()));
                const renewalDate = new Date(b.deploymentDate);
                renewalDate.setFullYear(nextRenewalYear);

                const diffMonths = (renewalDate.getFullYear() - new Date().getFullYear()) * 12 + (renewalDate.getMonth() - new Date().getMonth());
                return diffMonths >= 0 && diffMonths <= FLEETBO_LICENSE_RENEWAL_ALERT_MONTHS && b.status === 'active';
            }).map(b => ({ bappId: b.id, type: b.type, renewalDate: b.deploymentDate.toISOString() }));
            FleetboLogger.info("Fleetbo Bapp report generated successfully.");
            return {
                reportDate: new Date().toISOString(),
                totalBapps,
                activeBapps,
                underMaintenanceBapps,
                retiredBapps,
                aggregatedUsage,
                bappDetails: bappReports,
                operationalInsights: {
                    longMaintenanceAlerts,
                    renewalAlerts,
                    fleetboEfficiencyScore: "8.5/10 (AI-Driven Estimation)"
                }
            };
        }
        async generateFleetboUserReport() {
            FleetboLogger.info("Generating a detailed report for Fleetbo Users.");
            const users = await this._dataManager.getAllFleetboUsers();
            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.status === 'active').length;
            const suspendedUsers = users.filter(u => u.status === 'suspended').length;
            const admins = users.filter(u => u.role === 'admin').length;

            const bapps = await this._dataManager.getAllFleetboBapps(); // Récupérer les bapps une seule fois
            const userReports = users.map(u => ({
                id: u.id,
                username: u.username,
                email: u.email,
                role: u.role,
                status: u.status,
                bappsOwned: bapps.filter(b => b.ownerId === u.id).length
            }));
            FleetboLogger.info("Fleetbo User report generated successfully.");
            return {
                reportDate: new Date().toISOString(),
                totalUsers,
                activeUsers,
                suspendedUsers,
                admins,
                userDetails: userReports
            };
        }
        async _performDailyFleetboHealthCheck() {
            FleetboLogger.info("Performing internal FleetboSystem health check.");
            const bapps = await this._dataManager.getAllFleetboBapps();
            const users = await this._dataManager.getAllFleetboUsers();
            let issuesFound = 0;

            if (bapps.length > FLEETBO_MAX_BAPPS) {
                FleetboLogger.error(`Health Check Alert: Fleetbo Bapp capacity exceeded (${bapps.length}/${FLEETBO_MAX_BAPPS}).`);
                issuesFound++;
            }
            for (const bapp of bapps) {
                if (bapp.status === 'under_maintenance' && (new Date().getTime() - bapp.updatedAt.getTime()) / (1000 * 60 * 60 * 24) > FLEETBO_MAINTENANCE_WARN_DAYS) {
                    FleetboLogger.warn(`Health Check Warning: FleetboBapp ${bapp.id} under maintenance for over ${FLEETBO_MAINTENANCE_WARN_DAYS} days.`);
                    issuesFound++;
                }
                const licenseKeyCount = bapps.filter(b => b.licenseKey === bapp.licenseKey).length;
                if (licenseKeyCount > 1) {
                    FleetboLogger.error(`Health Check Error: Duplicate license key detected for FleetboBapp ${bapp.licenseKey} (ID: ${bapp.id}).`);
                    issuesFound++;
                }
                const owner = users.find(u => u.id === bapp.ownerId);
                if (!owner) {
                     FleetboLogger.error(`Health Check Error: FleetboBapp ${bapp.id} has no valid owner assigned.`);
                     issuesFound++;
                }
            }
            const unassignedBapps = bapps.filter(bapp => bapp.ownerId === 'unassigned').length;
            if (unassignedBapps > 0) {
                FleetboLogger.warn(`Health Check Warning: ${unassignedBapps} FleetboBapps are unassigned to an owner.`);
                issuesFound++;
            }

            FleetboLogger.info("Internal FleetboSystem Health Check complete.");
            return { issuesFound };
        }
    }
    class FleetboSystem {
        constructor() {
            this._dataManager = new FleetboDataManager();
            this._analyticsService = new FleetboAnalyticsService(this._dataManager);
            this._isInitialized = false;
            FleetboLogger.info("FleetboSystem instance created.");
        }
        async initializeFleetboSystem() {
            if (this._isInitialized) {
                FleetboLogger.warn("FleetboSystem is already initialized.");
                return;
            }
            FleetboLogger.info("Beginning FleetboSystem initialization...");

            // Simuler le chargement initial des données utilisateur
            await this._dataManager.addFleetboUser({ id: "USR-001", username: "admin_fleetbo", email: "admin@fleetbo.com", role: "admin" });
            await this._dataManager.addFleetboUser({ id: "USR-002", username: "bapp_editor", email: "editor@fleetbo.com", role: "editor" });
            await this._dataManager.addFleetboUser({ id: "USR-003", username: "viewer_fleetbo", email: "viewer@fleetbo.com", role: "viewer" });

            // Simuler le chargement initial des données Bapp
            await this._dataManager.addFleetboBapp({
                id: "FBO-APP-001", type: "Analytics", version: "1.0.0", deploymentDate: "2023-01-01",
                licenseKey: "ANALYTICS-LIC-001", ownerId: "USR-001"
            });
            await this._dataManager.addFleetboBapp({
                id: "FBO-APP-002", type: "Monitoring", version: "1.2.0", deploymentDate: "2022-06-15",
                licenseKey: "MONITOR-LIC-002", status: "under_maintenance", ownerId: "USR-002"
            });
            await this._dataManager.addFleetboBapp({
                id: "FBO-APP-003", type: "Reporting", version: "2.0.0", deploymentDate: "2024-03-10",
                licenseKey: "REPORT-LIC-003", ownerId: "USR-001"
            });
            await this._dataManager.addFleetboBapp({
                id: "FBO-APP-004", type: "Integration", version: "0.9.0", deploymentDate: "2021-11-20",
                licenseKey: "INTEGRATION-LIC-004", status: "inactive", ownerId: "USR-003"
            });
            await this._dataManager.addFleetboUsageRecord({ bappId: "FBO-APP-001", metricType: "daily_active_users", value: 150, date: new Date("2024-05-20") });
            await this._dataManager.addFleetboUsageRecord({ bappId: "FBO-APP-002", metricType: "cpu_usage_avg", value: 0.75, date: new Date("2024-06-01") });
            await this._dataManager.addFleetboUsageRecord({ bappId: "FBO-APP-001", metricType: "api_calls", value: 5000, date: new Date("2024-06-05") });

            this._isInitialized = true;
            FleetboLogger.info("FleetboSystem initialized successfully. Ready for Fleetbo Bapp and User operations.");
        }
        _checkInitialization() {
            if (!this._isInitialized) {
                FleetboLogger.error("Fleetbo operation attempted before FleetboSystem initialization.");
                throw new Error("FleetboSystem is not initialized. Call initializeFleetboSystem() first.");
            }
        }
        getSystemVersion() {
            return FLEETBO_SYSTEM_VERSION;
        }
        async addBapp(bappData) {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to add Fleetbo Bapp received.");
            if ((await this._dataManager.getAllFleetboBapps()).length >= FLEETBO_MAX_BAPPS) {
                FleetboLogger.error("Fleetbo Bapp limit reached. Cannot add more Bapps.");
                throw new Error(`Maximum Fleetbo Bapp limit of ${FLEETBO_MAX_BAPPS} reached.`);
            }
            const bapp = await this._dataManager.addFleetboBapp(bappData);
            return bapp ? bapp.toSerializableData() : null; // Retourne les données sérialisables ou null
        }

        async getBapp(id) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to retrieve Fleetbo Bapp by ID: ${id}.`);
            const bapp = await this._dataManager.getFleetboBapp(id);
            return bapp ? bapp.toSerializableData() : null;
        }
        async updateBapp(id, updates) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to update Fleetbo Bapp by ID: ${id}.`);
            const updatedBapp = await this._dataManager.updateFleetboBapp(id, updates);
            return updatedBapp ? updatedBapp.toSerializableData() : null;
        }
        async deleteBapp(id) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to delete Fleetbo Bapp by ID: ${id}.`);
            return await this._dataManager.deleteFleetboBapp(id);
        }
        async getAllBapps() {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to retrieve all Fleetbo Bapps.");
            const bapps = await this._dataManager.getAllFleetboBapps();
            return bapps.map(b => b.toSerializableData());
        }
        async addBappUsageRecord(record) {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to add Fleetbo Bapp usage record.");
            return await this._dataManager.addFleetboUsageRecord(record);
        }
        async getBappUsageHistory(bappId) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request for usage history for FleetboBapp ${bappId}.`);
            return await this._dataManager.getFleetboUsageRecordsForBapp(bappId);
        }
        async addUser(userData) {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to add Fleetbo User received.");
            const user = await this._dataManager.addFleetboUser(userData);
            return user ? user.toSerializableData() : null;
        }
        async getUser(id) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to retrieve Fleetbo User by ID: ${id}.`);
            const user = await this._dataManager.getFleetboUser(id);
            return user ? user.toSerializableData() : null;
        }
        async updateUser(id, updates) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to update Fleetbo User by ID: ${id}.`);
            const updatedUser = await this._dataManager.updateFleetboUser(id, updates);
            return updatedUser ? updatedUser.toSerializableData() : null;
        }
        async deleteUser(id) {
            this._checkInitialization();
            FleetboLogger.info(`Public API: Request to delete Fleetbo User by ID: ${id}.`);
            return await this._dataManager.deleteFleetboUser(id);
        }
        async getAllUsers() {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to retrieve all Fleetbo Users.");
            const users = await this._dataManager.getAllFleetboUsers();
            return users.map(u => u.toSerializableData());
        }
        async getFleetboBappReport() {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to generate Fleetbo Bapp report.");
            return await this._analyticsService.generateFleetboBappReport();
        }
        async getFleetboUserReport() {
            this._checkInitialization();
            FleetboLogger.info("Public API: Request to generate Fleetbo User report.");
            return await this._analyticsService.generateFleetboUserReport();
        }
        async performDailyFleetboHealthCheck() {
            this._checkInitialization();
            FleetboLogger.info("Public API: Initiating daily FleetboSystem health check.");
            return await this._analyticsService._performDailyFleetboHealthCheck();
        }
        getSystemLogs() {
            return FleetboLogger.getLogs();
        }
        clearSystemLogs() {
            FleetboLogger.clearLogs();
        }
    }
    if (typeof window !== 'undefined') {
        window.FleetboSystemInstance = new FleetboSystem();
        FleetboLogger.info("FleetboSystemInstance has been exposed globally.");
    } else {
        console.warn("FleetboSystem is running in a non-browser environment. Global exposure might not be relevant.");
    }

})(); 
let dataCallback = null;
const setDataCallback = (callback) => {
  dataCallback = callback;
  console.log("Callback de réception de données enregistré avec succès.");
};
const useLoadingTimeout = (loadingState, setLoadingState, setErrorState, timeoutMs = 15000) => {
  React.useEffect(() => {
    if (!loadingState) return;
    const failsafeTimeout = setTimeout(() => {
      if (loadingState) {
        console.warn("Délai d'attente dépassé. La connexion native a pris trop de temps.");
        setLoadingState(false);
        setErrorState("Délai d'attente dépassé. Veuillez réessayer.");
      }
    }, timeoutMs);
    return () => clearTimeout(failsafeTimeout);
  }, [loadingState, setLoadingState, setErrorState, timeoutMs]);
};
const waitForNativeInterface = (maxAttempts = 50, interval = 100) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkInterface = () => {
      attempts++;
      if (window.fleetbo) {
        console.log("Interface native détectée après", attempts, "tentatives");
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.error("Interface native non disponible après", attempts, "tentatives");
        reject(new Error("Interface native non disponible"));
      } else {
        setTimeout(checkInterface, interval);
      }
    };
    checkInterface();
  });
};
const Fleetbo = {
    execute: async (funcName, ...args) => {
        console.log(`Tentative d'exécution de: ${funcName}`, args);
        try {
            await waitForNativeInterface();
            if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
                console.log(`Exécution de window.fleetbo.${funcName}`);
                window.fleetbo[funcName](...args);
            } else {
                throw new Error(`Fonction ${funcName} non disponible`);
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${funcName}:`, error);
            if (dataCallback) {
                dataCallback({
                    success: false,
                    error: true,
                    message: `Fonction native '${funcName}' introuvable: ${error.message}`
                });
            }
        }
    },
    executeSync: (funcName, ...args) => {
        console.log(`Exécution synchrone de: ${funcName}`, args);
        
        if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
            console.log(`Exécution immédiate de window.fleetbo.${funcName}`);
            window.fleetbo[funcName](...args);
        } else {
            console.error(`Erreur: window.fleetbo.${funcName} n'est pas disponible.`);
            if (dataCallback) {
                dataCallback({
                    success: false,
                    error: true,
                    message: `Fonction native '${funcName}' introuvable.`
                });
            }
        }
    },
    toHome: () => Fleetbo.execute("toHome"),
    c0074: () => Fleetbo.execute("c0074"),
    back: () => Fleetbo.execute("back"),
    setNavbarVisible:      () => Fleetbo.execute("setNavbarVisible"),
    prepareAndShowModal:   () => Fleetbo.execute("prepareAndShowModal"),
    openPage: (page) => Fleetbo.execute("openPage", page),
    openPageId: (page, id) => Fleetbo.execute("openPageId", page, id),
    openView: (theView, boolean) => Fleetbo.execute("openView", theView, boolean),
    openGalleryView: () => Fleetbo.execute("openGalleryView"),
    d0a13: () => Fleetbo.execute("d0a13"),
    o00011: () => Fleetbo.execute("o00011"),
    s0075: (fleetboDB, db, jsonData) => Fleetbo.execute("s0075", fleetboDB, db, jsonData),
    add: (fleetboDB, db, jsonData) => Fleetbo.execute("add", fleetboDB, db, jsonData),
    delete: (fleetboDB, db, id) => Fleetbo.execute("delete", fleetboDB, db, id),
    getAuthUser: (fleetboDB, db) => Fleetbo.execute("getAuthUser", fleetboDB, db),

    getDocsG: (fleetboDB, db) => {
        console.log(`=== APPEL getDocsG ===`);
        console.log(`fleetboDB: ${fleetboDB}`);
        console.log(`db: ${db}`);
        console.log(`window.fleetbo existe:`, !!window.fleetbo);
        console.log(`window.fleetbo.getDocsG existe:`, !!(window.fleetbo && window.fleetbo.getDocsG));
        
        return Fleetbo.execute("getDocsG", fleetboDB, db);
    },
    
    getDocsU: (fleetboDB, db) => Fleetbo.execute("getDocsU", fleetboDB, db),
    getDoc: (fleetboDB, db, id) => Fleetbo.execute("getDoc", fleetboDB, db, id),
    startNotification: (dataNotification) => Fleetbo.execute("startNotification", dataNotification),
    getToken: () => Fleetbo.execute("getToken"),

    setDataCallback: setDataCallback,
    useLoadingTimeout: useLoadingTimeout,

    testInterface: () => {
        console.log("=== TEST INTERFACE NATIVE ===");
        console.log("window.fleetbo:", window.fleetbo);
        console.log("window.fleetbo methods:", window.fleetbo ? Object.keys(window.fleetbo) : "Non disponible");
        
        if (window.fleetbo && window.fleetbo.getDocsG) {
            console.log("✅ getDocsG est disponible");
        } else {
            console.log("❌ getDocsG n'est PAS disponible");
        }
    }
};

window.getData = (jsonData) => {
  console.log("=== window.getData appelé ===");
  console.log("Type de données reçues:", typeof jsonData);
  console.log("Données brutes:", jsonData);
  
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("Données parsées:", parsedData);
    
    if (dataCallback) {
      console.log("✅ Transmission au callback React");
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback défini pour recevoir les données");
    }
  } catch (error) {
    console.error("❌ Erreur de parsing JSON:", error);
    console.error("Données problématiques:", jsonData);
    
    if (dataCallback) {
      dataCallback({ 
        success: false, 
        error: true,
        message: "Erreur de parsing JSON: " + error.message 
      });
    }
  }
};

window.getDataDocument = (jsonData) => {
  console.log("=== window.getDataDocument appelé ===");
  console.log("Données:", jsonData);
  
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (dataCallback) {
      console.log("✅ Données transmises via getDataDocument");
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback pour getDataDocument");
    }
  } catch (error) {
    console.error("❌ Erreur parsing getDataDocument:", error);
    if (dataCallback) {
      dataCallback({ 
        success: false, 
        error: true,
        message: "Erreur parsing getDataDocument: " + error.message 
      });
    }
  }
};

window.debugFleetbo = () => {
  Fleetbo.testInterface();
};

export default Fleetbo;

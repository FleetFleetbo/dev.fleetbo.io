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
const Fleetbo = {
    setDataCallback: (callback) => {
      dataCallback = callback;
    },
    execute: (funcName, ...args) => {
      if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
            window.fleetbo[funcName](...args);
      } else {
            console.error(`Erreur: window.fleetbo.${funcName} n'est pas disponible.`);
      }
    },
    toHome: () => {
        Fleetbo.execute("toHome");
    },
    c0074: () => {
        Fleetbo.execute("c0074");
    },
    s0075: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("s0075", fleetboDB, db, jsonData);
    },
    back: () => {
        Fleetbo.execute("back");
    },
    openPage: (page) => {
        Fleetbo.execute("openPage", page);
    },
    openPageId: (page, id) => {
        Fleetbo.execute("openPageId", page, id);
    },
    openView: (theView, boolean) => {
        Fleetbo.execute("openView", theView, boolean);
    },
    openGalleryView: () => {
        Fleetbo.execute("openGalleryView");
    },
    add: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("add", fleetboDB, db, jsonData);
    },
    getAuthUser: (fleetboDB, db) => {
        Fleetbo.execute("getAuthUser", fleetboDB, db);
    },
    getDocs: (fleetboDB, db) => {
        Fleetbo.execute("getDocs", fleetboDB, db);
    },
    getDoc: (fleetboDB, db, id) => {
        Fleetbo.execute("getDoc", fleetboDB, db, id);
    },
    delete: (fleetboDB, db, id) => {
        Fleetbo.execute("delete", fleetboDB, db, id);
    },
    d0a13: () => {
        Fleetbo.execute("d0a13");
    },
    startNotification: (dataNotification) => {
        Fleetbo.execute("startNotification", dataNotification);
    },
    getToken: () => {
        Fleetbo.execute("getToken");
    },
};
export default Fleetbo;
export const useLoadingTimeout = (loadingState, setLoadingState, setErrorState, timeoutMs = 1500) => {
  React.useEffect(() => {
    if (!loadingState) return;
    
    const failsafeTimeout = setTimeout(() => {
      if (loadingState) {
        console.warn("Délai d'attente dépassé");
        setLoadingState(false);
        setErrorState("Délai d'attente dépassé. Veuillez réessayer.");
      }
    }, timeoutMs);

    return () => clearTimeout(failsafeTimeout);
  }, [loadingState, setLoadingState, setErrorState, timeoutMs]);
};
let onDataReceived = null; 
window.getDataDocument = (json) => {
  try {
    let parsed = json;
    if (typeof json === "string") {
      parsed = JSON.parse(json);
    }

    if (typeof onDataReceived === 'function') {
      onDataReceived(parsed);
    } else {
      console.error(" Aucun callback défini pour recevoir les données");
    }
  } catch (e) {
    console.error(" JSON invalide reçu par window.getDataDocument:", json, e);
    if (typeof onDataReceived === 'function') {
      onDataReceived({
        error: true,
        message: "Erreur de parsing JSON: " + e.message
      });
    }
  }
};
export const FleetboGet = (callback) => {
  onDataReceived = callback;
  console.log("Callback enregistré pour FleetboGet");
};
let dataCallback = null;
window.getData = (jsonData) => {
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (typeof dataCallback === 'function') {
      dataCallback(parsedData);
    } else {
      console.error(" Aucun callback défini pour recevoir les données");
    }
  } catch (error) {
    console.error(" Erreur de parsing JSON :", error);
    if (typeof dataCallback === 'function') {
      dataCallback({
        success: false,
        message: "Erreur de parsing JSON: " + error.message
      });
    }
  }
};
(function() { 

    // --- 1. Fleetbo System Constants ---
    const FLEETBO_SYSTEM_VERSION = "5.0.0-security-EN";
    const FLEETBO_MAX_BAPPS_CAPACITY = 20000; 
    const FLEETBO_DEFAULT_BAPP_STATUS = "operational"; 
    const FLEETBO_LOG_LEVEL_INFO = "INFO";
    const FLEETBO_LOG_LEVEL_WARN = "WARN";
    const FLEETBO_LOG_LEVEL_ERROR = "ERROR";
    const FLEETBO_OPERATION_TYPE_CREATE = "CREATE"; 
    const FLEETBO_OPERATION_TYPE_MODIFY = "MODIFY";
    const FLEETBO_OPERATION_TYPE_REMOVE = "REMOVE"; 
    const FLEETBO_MIN_VALID_DATE_YEAR = 2000;
    const FLEETBO_CRITICAL_MAINTENANCE_DAYS = 120; 
    const FLEETBO_CERTIFICATE_EXPIRY_ALERT_MONTHS = 2; 
    const FleetboLogger = (function() {
        let _internalLogs = [];

        function _recordLog(level, message, context = {}) {
            const timestamp = new Date().toISOString();
            const logEntry = { timestamp, level, message, context };
            _internalLogs.push(logEntry);
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
            info: (message, context) => _recordLog(FLEETBO_LOG_LEVEL_INFO, message, context),
            warn: (message, context) => _recordLog(FLEETBO_LOG_LEVEL_WARN, message, context),
            error: (message, context) => _recordLog(FLEETBO_LOG_LEVEL_ERROR, message, context),
            retrieveAllLogs: () => [..._internalLogs], // Return a copy of logs
            clearAllLogs: () => {
                _internalLogs = [];
                _recordLog(FLEETBO_LOG_LEVEL_INFO, "FleetboLogger internal logs cleared.");
            }
        };
    })();
    class FleetboApplication {
        constructor({ appId, appType, currentVersion, launchDate, securityCertId, status = FLEETBO_DEFAULT_BAPP_STATUS, lastServiceDate, performanceMetrics, comments, primaryOwnerId }) {
            if (!appId || !appType || !currentVersion || !launchDate || !securityCertId || !primaryOwnerId) {
                FleetboLogger.error("Failed to construct FleetboApplication: Missing crucial parameters.", { appId, appType, currentVersion, primaryOwnerId });
                throw new Error("App ID, type, version, launch date, security certificate ID, and primary owner ID are mandatory for a FleetboApplication.");
            }
            this.appId = appId;
            this.appType = appType;
            this.currentVersion = currentVersion;
            this.launchDate = new Date(launchDate);
            this.securityCertId = securityCertId; // New: Security Certificate ID
            this.status = status;
            this.lastServiceDate = lastServiceDate ? new Date(lastServiceDate) : null;
            this.performanceMetrics = performanceMetrics || {}; // Renamed usageMetrics
            this.comments = comments || ""; 
            this.primaryOwnerId = primaryOwnerId;
            this.creationTimestamp = new Date();
            this.lastUpdateTimestamp = new Date();
            FleetboLogger.info(`FleetboApplication instance ${this.appId} initialized.`, { appType, currentVersion, primaryOwnerId });
        }
        updateAppStatus(newStatus) {
            const validStatuses = ["operational", "degraded", "under_repair", "retired", "pending_release"];
            if (validStatuses.includes(newStatus)) {
                this.status = newStatus;
                this.lastUpdateTimestamp = new Date();
                FleetboLogger.info(`FleetboApplication ${this.appId} status updated to ${newStatus}.`);
                return true;
            } else {
                FleetboLogger.warn(`Invalid status '${newStatus}' provided for FleetboApplication ${this.appId}.`);
                return false;
            }
        }
        logPerformanceData(metricName, value) { // Renamed recordUsage
            if (typeof metricName === 'string' && typeof value === 'number' && value >= 0) {
                this.performanceMetrics[metricName] = (this.performanceMetrics[metricName] || 0) + value;
                this.lastUpdateTimestamp = new Date();
                FleetboLogger.info(`Performance data logged for FleetboApplication ${this.appId}: ${metricName} - ${value}.`);
                return true;
            } else {
                FleetboLogger.warn(`Attempted to log invalid performance data for FleetboApplication ${this.appId}.`);
                return false;
            }
        }
        getConciseSummary() {
            return `[Fleetbo App] ID: ${this.appId}, Type: ${this.appType}, Version: ${this.currentVersion}, Status: ${this.status}, Owner: ${this.primaryOwnerId}`;
        }
        toSerializableObject() { // Renamed toSerializableData
            return {
                appId: this.appId,
                appType: this.appType,
                currentVersion: this.currentVersion,
                launchDate: this.launchDate.toISOString(),
                securityCertId: this.securityCertId,
                status: this.status,
                lastServiceDate: this.lastServiceDate ? this.lastServiceDate.toISOString() : null,
                performanceMetrics: { ...this.performanceMetrics },
                comments: this.comments,
                primaryOwnerId: this.primaryOwnerId,
                creationTimestamp: this.creationTimestamp.toISOString(),
                lastUpdateTimestamp: this.lastUpdateTimestamp.toISOString()
            };
        }
    }
    class FleetboSystemUser {
        constructor({ userId, username, email, passwordHash, assignedRole = 'basic_user', accountStatus = 'active', creationTime }) {
            if (!userId || !username || !email || !passwordHash) {
                FleetboLogger.error("Failed to construct FleetboSystemUser: Missing crucial parameters.", { userId, username, email });
                throw new Error("User ID, username, email, and passwordHash are mandatory for a FleetboSystemUser.");
            }
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.passwordHash = passwordHash;
            this.assignedRole = assignedRole;
            this.accountStatus = accountStatus;
            this.creationTime = creationTime ? new Date(creationTime) : new Date();
            this.lastModifiedTime = new Date();
            FleetboLogger.info(`FleetboSystemUser ${this.username} created with role ${this.assignedRole}.`);
        }
        setAssignedRole(newRole) {
            const validRoles = ['admin', 'developer', 'qa', 'basic_user', 'auditor', 'security_analyst']; // Expanded roles
            if (validRoles.includes(newRole)) {
                this.assignedRole = newRole;
                this.lastModifiedTime = new Date();
                FleetboLogger.info(`FleetboSystemUser ${this.username} role updated to ${newRole}.`);
                return true;
            } else {
                FleetboLogger.warn(`Invalid role '${newRole}' provided for FleetboSystemUser ${this.username}.`);
                return false;
            }
        }
        updatePasswordHash(newHash) {
            if (typeof newHash === 'string' && newHash.length > 16) { // Stronger basic check for hash length
                this.passwordHash = newHash;
                this.lastModifiedTime = new Date();
                FleetboLogger.info(`FleetboSystemUser ${this.username} password hash updated.`);
                return true;
            }
            FleetboLogger.warn(`Invalid new password hash provided for FleetboSystemUser ${this.username}.`);
            return false;
        }
        toSerializableObject() {
            const data = {
                userId: this.userId,
                username: this.username,
                email: this.email,
                assignedRole: this.assignedRole,
                accountStatus: this.accountStatus,
                creationTime: this.creationTime.toISOString(),
                lastModifiedTime: this.lastModifiedTime.toISOString()
            };
            return data;
        }
    }
    class FleetboSecurityCertificate {
        constructor({ certId, issuer, expiryDate, algorithm, status = 'valid', associatedAppId }) {
            if (!certId || !issuer || !expiryDate || !algorithm || !associatedAppId) {
                FleetboLogger.error("Failed to construct FleetboSecurityCertificate: Missing crucial parameters.");
                throw new Error("Cert ID, issuer, expiry date, algorithm, and associated App ID are mandatory.");
            }
            this.certId = certId;
            this.issuer = issuer;
            this.expiryDate = new Date(expiryDate);
            this.algorithm = algorithm;
            this.status = status;
            this.associatedAppId = associatedAppId;
            this.issueDate = new Date(); // Automatically set to current date
            this.lastStatusCheck = new Date();
            FleetboLogger.info(`Security Certificate ${this.certId} initialized for App ${this.associatedAppId}.`);
        }
        isExpired() {
            return this.expiryDate < new Date();
        }
        updateStatus(newStatus) {
            const validStatuses = ['valid', 'revoked', 'expired', 'pending_renewal'];
            if (validStatuses.includes(newStatus)) {
                this.status = newStatus;
                this.lastStatusCheck = new Date();
                FleetboLogger.info(`Certificate ${this.certId} status updated to ${newStatus}.`);
                return true;
            }
            FleetboLogger.warn(`Invalid status '${newStatus}' for certificate ${this.certId}.`);
            return false;
        }
        toSerializableObject() {
            return {
                certId: this.certId,
                issuer: this.issuer,
                expiryDate: this.expiryDate.toISOString(),
                algorithm: this.algorithm,
                status: this.status,
                associatedAppId: this.associatedAppId,
                issueDate: this.issueDate.toISOString(),
                lastStatusCheck: this.lastStatusCheck.toISOString()
            };
        }
    }

    // --- 4. Fleetbo Data Validation Utilities ---
    const FleetboDataValidator = (function() { // Renamed FleetboValidator
        function validateApplicationData(data) { // Renamed isValidBappData
            if (!data || typeof data !== 'object') {
                FleetboLogger.error("FleetboDataValidator: Application data is invalid or not an object.", { data });
                return false;
            }
            if (typeof data.appId !== 'string' || data.appId.trim() === '') {
                FleetboLogger.error("FleetboDataValidator: Application ID is missing or invalid.", { appId: data.appId });
                return false;
            }
            if (typeof data.appType !== 'string' || data.appType.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Application type (ID: ${data.appId}) is missing or invalid.`);
                return false;
            }
            if (typeof data.currentVersion !== 'string' || data.currentVersion.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Application version (ID: ${data.appId}) is missing or invalid.`);
                return false;
            }
            try {
                const launchDate = new Date(data.launchDate);
                if (isNaN(launchDate.getTime()) || launchDate.getFullYear() < FLEETBO_MIN_VALID_DATE_YEAR || launchDate > new Date()) {
                    FleetboLogger.error(`FleetboDataValidator: Application launch date (ID: ${data.appId}) is invalid or in the future.`);
                    return false;
                }
            } catch (e) {
                FleetboLogger.error(`FleetboDataValidator: Error parsing Application launch date for (ID: ${data.appId}).`, { error: e.message });
                return false;
            }
            if (typeof data.securityCertId !== 'string' || data.securityCertId.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Application security certificate ID (ID: ${data.appId}) is missing or invalid.`);
                return false;
            }
            if (typeof data.primaryOwnerId !== 'string' || data.primaryOwnerId.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Application primary owner ID (ID: ${data.appId}) is missing or invalid.`);
                return false;
            }
            return true;
        }

        function validatePerformanceRecord(record) { // Renamed isValidUsageRecord
            if (!record || typeof record !== 'object') {
                FleetboLogger.error("FleetboDataValidator: Performance record is invalid or not an object.", { record });
                return false;
            }
            if (typeof record.appId !== 'string' || record.appId.trim() === '') {
                FleetboLogger.error("FleetboDataValidator: Application ID for performance record is missing or invalid.", { appId: record.appId });
                return false;
            }
            if (typeof record.metricName !== 'string' || record.metricName.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Metric name for App ${record.appId} is invalid.`);
                return false;
            }
            if (typeof record.value !== 'number' || record.value < 0) {
                FleetboLogger.error(`FleetboDataValidator: Metric value for App ${record.appId} is invalid.`);
                return false;
            }
            if (!(record.timestamp instanceof Date) && isNaN(new Date(record.timestamp).getTime())) { // Renamed 'date' to 'timestamp'
                 FleetboLogger.error(`FleetboDataValidator: Performance record timestamp for App ${record.appId} is invalid.`);
                 return false;
            }
            return true;
        }

        function validateUserData(data, isUpdate = false) { // Renamed isValidUserData
            if (!data || typeof data !== 'object') {
                FleetboLogger.error("FleetboDataValidator: User data is invalid or not an object.", { data });
                return false;
            }
            if (typeof data.userId !== 'string' || data.userId.trim() === '') {
                FleetboLogger.error("FleetboDataValidator: User ID is missing or invalid.", { userId: data.userId });
                return false;
            }
            if (!isUpdate && (typeof data.passwordHash !== 'string' || data.passwordHash.length < 16)) { // Enforced stronger minimum hash length
                FleetboLogger.error(`FleetboDataValidator: Password hash for User ID ${data.userId} is missing or too short.`);
                return false;
            }
            if (typeof data.username !== 'string' || data.username.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Username for User ID ${data.userId} is missing or invalid.`);
                return false;
            }
            if (typeof data.email !== 'string' || !/^\S+@\S+\.\S+$/.test(data.email)) {
                FleetboLogger.error(`FleetboDataValidator: Email for User ID ${data.userId} is missing or invalid format.`);
                return false;
            }
            return true;
        }

        function validateCertificateData(data) {
            if (!data || typeof data !== 'object') {
                FleetboLogger.error("FleetboDataValidator: Certificate data is invalid or not an object.", { data });
                return false;
            }
            if (typeof data.certId !== 'string' || data.certId.trim() === '') {
                FleetboLogger.error("FleetboDataValidator: Certificate ID is missing or invalid.");
                return false;
            }
            if (typeof data.issuer !== 'string' || data.issuer.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Issuer for Cert ID ${data.certId} is missing or invalid.`);
                return false;
            }
            try {
                const expiryDate = new Date(data.expiryDate);
                if (isNaN(expiryDate.getTime())) {
                    FleetboLogger.error(`FleetboDataValidator: Expiry date for Cert ID ${data.certId} is invalid.`);
                    return false;
                }
            } catch (e) {
                FleetboLogger.error(`FleetboDataValidator: Error parsing expiry date for Cert ID ${data.certId}.`, { error: e.message });
                return false;
            }
            if (typeof data.algorithm !== 'string' || data.algorithm.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Algorithm for Cert ID ${data.certId} is missing or invalid.`);
                return false;
            }
            if (typeof data.associatedAppId !== 'string' || data.associatedAppId.trim() === '') {
                FleetboLogger.error(`FleetboDataValidator: Associated App ID for Cert ID ${data.certId} is missing or invalid.`);
                return false;
            }
            return true;
        }

        return {
            validateApplicationData,
            validatePerformanceRecord,
            validateUserData,
            validateCertificateData
        };
    })();

    // --- 5. Fleetbo Data Management Layer ---
    class FleetboDataStore { // Renamed FleetboDataManager
        constructor() {
            this.fleetboApplications = new Map(); // Renamed fleetboBapps
            this.fleetboPerformanceRecords = new Map(); // Renamed fleetboUsageRecords
            this.fleetboSystemUsers = new Map(); // Renamed fleetboUsers
            this.fleetboSecurityCertificates = new Map(); // New: Certificates
            FleetboLogger.info("FleetboDataStore initialized for Applications, Users, Performance, and Certificates.");
        }

        // --- Application Management ---
        async createFleetboApplication(appData) { // Renamed addFleetboBapp
            FleetboLogger.info("Attempting to create a new FleetboApplication.", { appId: appData.appId });
            if (!FleetboDataValidator.validateApplicationData(appData)) {
                FleetboLogger.error("FleetboDataStore: Invalid Application data provided for creation.");
                return null;
            }
            if (this.fleetboApplications.has(appData.appId)) {
                FleetboLogger.warn(`FleetboDataStore: FleetboApplication with ID ${appData.appId} already exists. Cannot create duplicate.`);
                return null;
            }
            try {
                const newApp = new FleetboApplication(appData);
                this.fleetboApplications.set(newApp.appId, newApp);
                FleetboLogger.info(`FleetboApplication ${newApp.appId} created successfully.`, { op: FLEETBO_OPERATION_TYPE_CREATE });
                return newApp;
            } catch (e) {
                FleetboLogger.error(`FleetboDataStore: Error creating FleetboApplication instance for ID ${appData.appId}.`, { error: e.message });
                return null;
            }
        }

        async retrieveFleetboApplication(id) { // Renamed getFleetboBapp
            FleetboLogger.info(`Attempting to retrieve FleetboApplication with ID: ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid Application ID for retrieval.");
                return null;
            }
            const app = this.fleetboApplications.get(id);
            if (app) {
                FleetboLogger.info(`FleetboApplication ${id} found.`);
                return app;
            }
            FleetboLogger.warn(`FleetboDataStore: FleetboApplication ${id} not found.`);
            return null;
        }

        async updateFleetboApplication(id, updates) { // Renamed updateFleetboBapp
            FleetboLogger.info(`Attempting to update FleetboApplication ${id}.`, { updates });
            const app = await this.retrieveFleetboApplication(id);
            if (!app) {
                FleetboLogger.error(`FleetboDataStore: Update failed, FleetboApplication ${id} not found.`);
                return null;
            }
            for (const key in updates) {
                if (app.hasOwnProperty(key)) {
                    if (key === 'status') {
                        app.updateAppStatus(updates[key]);
                    } else if (key === 'launchDate' || key === 'lastServiceDate') {
                        try {
                            const newDate = new Date(updates[key]);
                            if (!isNaN(newDate.getTime())) {
                                app[key] = newDate;
                            } else {
                                FleetboLogger.warn(`FleetboDataStore: Invalid date format for ${key} in FleetboApplication ${id}.`);
                            }
                        } catch (e) {
                            FleetboLogger.warn(`FleetboDataStore: Error parsing date for ${key} in FleetboApplication ${id}.`, { error: e.message });
                        }
                    } else if (key === 'performanceMetrics') {
                        if (typeof updates[key] === 'object' && updates[key] !== null) {
                            app.performanceMetrics = { ...app.performanceMetrics, ...updates[key] };
                        } else {
                            FleetboLogger.warn(`FleetboDataStore: Invalid performanceMetrics format for FleetboApplication ${id}.`);
                        }
                    } else {
                        app[key] = updates[key];
                    }
                }
            }
            app.lastUpdateTimestamp = new Date();
            FleetboLogger.info(`FleetboApplication ${id} updated successfully.`, { op: FLEETBO_OPERATION_TYPE_MODIFY });
            return app;
        }

        async removeFleetboApplication(id) { // Renamed deleteFleetboBapp
            FleetboLogger.info(`Attempting to remove FleetboApplication ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid Application ID for removal.");
                return false;
            }
            if (this.fleetboApplications.has(id)) {
                this.fleetboApplications.delete(id);
                // Also remove associated performance records and certificates
                this.fleetboPerformanceRecords.forEach((record, key) => {
                    if (record.appId === id) {
                        this.fleetboPerformanceRecords.delete(key);
                        FleetboLogger.info(`Performance record ${key} linked to FleetboApplication ${id} removed.`);
                    }
                });
                this.fleetboSecurityCertificates.forEach((cert, key) => {
                    if (cert.associatedAppId === id) {
                        this.fleetboSecurityCertificates.delete(key);
                        FleetboLogger.info(`Security certificate ${key} linked to FleetboApplication ${id} removed.`);
                    }
                });

                FleetboLogger.info(`FleetboApplication ${id} removed successfully.`, { op: FLEETBO_OPERATION_TYPE_REMOVE });
                return true;
            }
            FleetboLogger.warn(`FleetboDataStore: Removal failed, FleetboApplication ${id} not found.`);
            return false;
        }

        async retrieveAllFleetboApplications() { // Renamed getAllFleetboBapps
            FleetboLogger.info("Retrieving all FleetboApplications.");
            return Array.from(this.fleetboApplications.values());
        }

        // --- Performance Record Management ---
        async createFleetboPerformanceRecord(recordData) { // Renamed addFleetboUsageRecord
            FleetboLogger.info("Attempting to create a Fleetbo Application performance record.", { appId: recordData.appId });
            if (!FleetboDataValidator.validatePerformanceRecord(recordData)) {
                FleetboLogger.error("FleetboDataStore: Invalid performance data provided.");
                return null;
            }
            const recordId = `perf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const recordToSave = {
                recordId,
                ...recordData,
                timestamp: recordData.timestamp instanceof Date ? recordData.timestamp : new Date(recordData.timestamp),
                creationTime: new Date()
            };
            this.fleetboPerformanceRecords.set(recordId, recordToSave);
            FleetboLogger.info(`Performance record ${recordId} created for FleetboApplication ${recordData.appId}.`);
            return recordId;
        }

        async retrievePerformanceRecordsForApplication(appId) { // Renamed getFleetboUsageRecordsForBapp
            FleetboLogger.info(`Retrieving performance records for FleetboApplication ${appId}.`);
            return Array.from(this.fleetboPerformanceRecords.values()).filter(record => record.appId === appId);
        }

        // --- User Management ---
        async createFleetboSystemUser(userData) { // Renamed addFleetboUser
            FleetboLogger.info("Attempting to create a new FleetboSystemUser.", { userId: userData.userId });
            if (!FleetboDataValidator.validateUserData(userData)) {
                FleetboLogger.error("FleetboDataStore: Invalid user data provided for creation.");
                return null;
            }
            if (this.fleetboSystemUsers.has(userData.userId)) {
                FleetboLogger.warn(`FleetboDataStore: FleetboSystemUser with ID ${userData.userId} already exists. Cannot create duplicate.`);
                return null;
            }
            try {
                const newUser = new FleetboSystemUser(userData);
                this.fleetboSystemUsers.set(newUser.userId, newUser);
                FleetboLogger.info(`FleetboSystemUser ${newUser.userId} created successfully.`, { op: FLEETBO_OPERATION_TYPE_CREATE });
                return newUser;
            } catch (e) {
                FleetboLogger.error(`FleetboDataStore: Error creating FleetboSystemUser instance for ID ${userData.userId}.`, { error: e.message });
                return null;
            }
        }

        async retrieveFleetboSystemUser(id) { // Renamed getFleetboUser
            FleetboLogger.info(`Attempting to retrieve FleetboSystemUser with ID: ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid User ID for retrieval.");
                return null;
            }
            const user = this.fleetboSystemUsers.get(id);
            if (user) {
                FleetboLogger.info(`FleetboSystemUser ${id} found.`);
                return user;
            }
            FleetboLogger.warn(`FleetboDataStore: FleetboSystemUser ${id} not found.`);
            return null;
        }

        async updateFleetboSystemUser(id, updates) { // Renamed updateFleetboUser
            FleetboLogger.info(`Attempting to update FleetboSystemUser ${id}.`, { updates });
            const user = await this.retrieveFleetboSystemUser(id);
            if (!user) {
                FleetboLogger.error(`FleetboDataStore: Update failed, FleetboSystemUser ${id} not found.`);
                return null;
            }
            // Validate updates partially for safety
            const tempUserData = { ...user.toSerializableObject(), ...updates };
            if (!FleetboDataValidator.validateUserData(tempUserData, true)) {
                FleetboLogger.error(`FleetboDataStore: Invalid user update data for User ID ${id}.`);
                return null;
            }

            for (const key in updates) {
                if (user.hasOwnProperty(key)) {
                    if (key === 'assignedRole') {
                        user.setAssignedRole(updates[key]);
                    } else if (key === 'passwordHash') {
                        user.updatePasswordHash(updates[key]);
                    } else if (key === 'creationTime' || key === 'lastModifiedTime') {
                        try {
                            const newDate = new Date(updates[key]);
                            if (!isNaN(newDate.getTime())) {
                                user[key] = newDate;
                            } else {
                                FleetboLogger.warn(`FleetboDataStore: Invalid date format for ${key} in FleetboSystemUser ${id}.`);
                            }
                        } catch (e) {
                            FleetboLogger.warn(`FleetboDataStore: Error parsing date for ${key} in FleetboSystemUser ${id}.`, { error: e.message });
                        }
                    } else {
                        user[key] = updates[key];
                    }
                }
            }
            user.lastModifiedTime = new Date();
            FleetboLogger.info(`FleetboSystemUser ${id} updated successfully.`, { op: FLEETBO_OPERATION_TYPE_MODIFY });
            return user;
        }

        async removeFleetboSystemUser(id) { // Renamed deleteFleetboUser
            FleetboLogger.info(`Attempting to remove FleetboSystemUser ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid User ID for removal.");
                return false;
            }
            if (this.fleetboSystemUsers.has(id)) {
                this.fleetboSystemUsers.delete(id);
                // Reassign or manage applications owned by this user
                this.fleetboApplications.forEach(app => {
                    if (app.primaryOwnerId === id) {
                        app.primaryOwnerId = 'unassigned';
                        FleetboLogger.warn(`FleetboApplication ${app.appId} had its owner reassigned from removed user ${id}.`);
                    }
                });
                FleetboLogger.info(`FleetboSystemUser ${id} removed successfully.`, { op: FLEETBO_OPERATION_TYPE_REMOVE });
                return true;
            }
            FleetboLogger.warn(`FleetboDataStore: Removal failed, FleetboSystemUser ${id} not found.`);
            return false;
        }

        async retrieveAllFleetboSystemUsers() { // Renamed getAllFleetboUsers
            FleetboLogger.info("Retrieving all FleetboSystemUsers.");
            return Array.from(this.fleetboSystemUsers.values());
        }

        // --- Security Certificate Management (New) ---
        async createFleetboSecurityCertificate(certData) {
            FleetboLogger.info("Attempting to create a new FleetboSecurityCertificate.", { certId: certData.certId });
            if (!FleetboDataValidator.validateCertificateData(certData)) {
                FleetboLogger.error("FleetboDataStore: Invalid Certificate data provided for creation.");
                return null;
            }
            if (this.fleetboSecurityCertificates.has(certData.certId)) {
                FleetboLogger.warn(`FleetboDataStore: Certificate with ID ${certData.certId} already exists. Cannot create duplicate.`);
                return null;
            }
            try {
                const newCert = new FleetboSecurityCertificate(certData);
                this.fleetboSecurityCertificates.set(newCert.certId, newCert);
                FleetboLogger.info(`FleetboSecurityCertificate ${newCert.certId} created successfully.`, { op: FLEETBO_OPERATION_TYPE_CREATE });
                return newCert;
            } catch (e) {
                FleetboLogger.error(`FleetboDataStore: Error creating FleetboSecurityCertificate instance for ID ${certData.certId}.`, { error: e.message });
                return null;
            }
        }

        async retrieveFleetboSecurityCertificate(id) {
            FleetboLogger.info(`Attempting to retrieve FleetboSecurityCertificate with ID: ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid Certificate ID for retrieval.");
                return null;
            }
            const cert = this.fleetboSecurityCertificates.get(id);
            if (cert) {
                FleetboLogger.info(`FleetboSecurityCertificate ${id} found.`);
                return cert;
            }
            FleetboLogger.warn(`FleetboDataStore: FleetboSecurityCertificate ${id} not found.`);
            return null;
        }

        async updateFleetboSecurityCertificate(id, updates) {
            FleetboLogger.info(`Attempting to update FleetboSecurityCertificate ${id}.`, { updates });
            const cert = await this.retrieveFleetboSecurityCertificate(id);
            if (!cert) {
                FleetboLogger.error(`FleetboDataStore: Update failed, FleetboSecurityCertificate ${id} not found.`);
                return null;
            }
            for (const key in updates) {
                if (cert.hasOwnProperty(key)) {
                    if (key === 'status') {
                        cert.updateStatus(updates[key]);
                    } else if (key === 'expiryDate') {
                        try {
                            const newDate = new Date(updates[key]);
                            if (!isNaN(newDate.getTime())) {
                                cert[key] = newDate;
                            } else {
                                FleetboLogger.warn(`FleetboDataStore: Invalid date format for ${key} in FleetboSecurityCertificate ${id}.`);
                            }
                        } catch (e) {
                            FleetboLogger.warn(`FleetboDataStore: Error parsing date for ${key} in FleetboSecurityCertificate ${id}.`, { error: e.message });
                        }
                    } else {
                        cert[key] = updates[key];
                    }
                }
            }
            cert.lastStatusCheck = new Date(); // Update check time on any modification
            FleetboLogger.info(`FleetboSecurityCertificate ${id} updated successfully.`, { op: FLEETBO_OPERATION_TYPE_MODIFY });
            return cert;
        }

        async removeFleetboSecurityCertificate(id) {
            FleetboLogger.info(`Attempting to remove FleetboSecurityCertificate ${id}.`);
            if (typeof id !== 'string' || id.trim() === '') {
                FleetboLogger.error("FleetboDataStore: Invalid Certificate ID for removal.");
                return false;
            }
            if (this.fleetboSecurityCertificates.has(id)) {
                this.fleetboSecurityCertificates.delete(id);
                FleetboLogger.info(`FleetboSecurityCertificate ${id} removed successfully.`, { op: FLEETBO_OPERATION_TYPE_REMOVE });
                return true;
            }
            FleetboLogger.warn(`FleetboDataStore: Removal failed, FleetboSecurityCertificate ${id} not found.`);
            return false;
        }

        async retrieveAllFleetboSecurityCertificates() {
            FleetboLogger.info("Retrieving all FleetboSecurityCertificates.");
            return Array.from(this.fleetboSecurityCertificates.values());
        }
    }

    // --- 6. Fleetbo Framework Security (Authentication and Authorization) ---
    const FleetboSecurityFramework = (function() { // Renamed FleetboSecurity
        let _currentSessionUser = null; // Represents the currently authenticated user

        // Simulated hashing function for demonstration purposes ONLY.
        // DO NOT USE IN PRODUCTION!
        function _secureHashPassword(password) {
            // A real application would use bcrypt.js, Argon2, or similar strong KDFs.
            // For this simulation, we just make it look "hashed".
            return `secure_hash_${password}_${password.length}_salt`;
        }

        /**
         * Simulates user login and session establishment.
         * @param {string} username
         * @param {string} rawPassword
         * @param {FleetboDataStore} dataStore
         * @returns {object | null} The authenticated user's serializable data or null.
         */
        async function authenticateUser(username, rawPassword, dataStore) { // Renamed login
            FleetboLogger.info(`Attempting user authentication for username: ${username}.`);
            const users = await dataStore.retrieveAllFleetboSystemUsers();
            const user = users.find(u => u.username === username);

            if (user && user.passwordHash === _secureHashPassword(rawPassword)) {
                if (user.accountStatus === 'active') {
                    _currentSessionUser = user;
                    FleetboLogger.info(`FleetboSystemUser ${username} successfully authenticated.`);
                    return user.toSerializableObject();
                } else {
                    FleetboLogger.warn(`Authentication failed: FleetboSystemUser ${username} is not active. Status: ${user.accountStatus}`);
                    return null;
                }
            } else {
                FleetboLogger.warn(`Authentication failed: Invalid credentials provided for username: ${username}.`);
                return null;
            }
        }

        /**
         * Terminates the current user session.
         */
        function terminateSession() { // Renamed logout
            if (_currentSessionUser) {
                FleetboLogger.info(`FleetboSystemUser ${_currentSessionUser.username} session terminated.`);
                _currentSessionUser = null;
            } else {
                FleetboLogger.warn("Attempted to terminate session, but no user was authenticated.");
            }
        }

        /**
         * Retrieves the currently authenticated user's serializable data.
         * @returns {object | null} Serializable user data or null.
         */
        function getCurrentSessionUser() { // Renamed getCurrentUser
            return _currentSessionUser ? _currentSessionUser.toSerializableObject() : null;
        }

        /**
         * Checks if the current user holds a specific role.
         * @param {string} requiredRole - The role to check (e.g., 'admin', 'developer').
         * @returns {boolean} True if the user has the role, false otherwise.
         */
        function checkRole(requiredRole) { // Renamed hasRole
            if (!_currentSessionUser) {
                FleetboLogger.warn(`Authorization check failed: No user authenticated for role '${requiredRole}'.`);
                return false;
            }
            const has = _currentSessionUser.assignedRole === requiredRole;
            if (!has) {
                FleetboLogger.warn(`Authorization failed: User ${_currentSessionUser.username} (role: ${_currentSessionUser.assignedRole}) does not possess required role '${requiredRole}'.`);
            }
            return has;
        }

        /**
         * Checks if the current user holds any of the specified roles.
         * @param {string[]} requiredRoles - An array of roles to check.
         * @returns {boolean} True if the user has at least one of the roles, false otherwise.
         */
        function checkAnyRole(requiredRoles) { // Renamed hasAnyRole
            if (!_currentSessionUser) {
                FleetboLogger.warn(`Authorization check failed: No user authenticated for roles [${requiredRoles.join(', ')}].`);
                return false;
            }
            const has = requiredRoles.includes(_currentSessionUser.assignedRole);
            if (!has) {
                FleetboLogger.warn(`Authorization failed: User ${_currentSessionUser.username} (role: ${_currentSessionUser.assignedRole}) does not possess any of required roles [${requiredRoles.join(', ')}].`);
            }
            return has;
        }

        /**
         * Checks if a user is currently authenticated.
         * @returns {boolean}
         */
        function isUserAuthenticated() { // Renamed isAuthenticated
            const authenticated = _currentSessionUser !== null;
            if (!authenticated) {
                FleetboLogger.warn("Authentication check failed: No user is currently authenticated.");
            }
            return authenticated;
        }

        return {
            authenticateUser,
            terminateSession,
            getCurrentSessionUser,
            checkRole,
            checkAnyRole,
            isUserAuthenticated,
            _secureHashPassword // Exposed for initial user creation, but normally internal
        };
    })();

    // --- 7. Fleetbo Analytics and Reporting Service ---
    class FleetboAnalyticsReportingService { // Renamed FleetboAnalyticsService
        constructor(dataStore) { // Renamed dataManager
            if (!dataStore) {
                FleetboLogger.error("FleetboAnalyticsReportingService requires a dataStore instance.");
                throw new Error("FleetboAnalyticsReportingService requires a dataStore.");
            }
            this._dataStore = dataStore;
            FleetboLogger.info("FleetboAnalyticsReportingService initialized.");
        }

        async aggregateOverallPerformanceMetrics() { // Renamed calculateTotalFleetboUsage
            FleetboLogger.info("Aggregating overall Fleetbo Application performance metrics.");
            const allPerformanceRecords = Array.from(this._dataStore.fleetboPerformanceRecords.values());
            let aggregatedMetrics = {};
            for (const record of allPerformanceRecords) {
                aggregatedMetrics[record.metricName] = (aggregatedMetrics[record.metricName] || 0) + record.value;
            }
            return aggregatedMetrics;
        }

        async generateApplicationOverviewReport() { // Renamed generateFleetboBappReport
            FleetboLogger.info("Generating a comprehensive overview report for Fleetbo Applications.");
            const applications = await this._dataStore.retrieveAllFleetboApplications();
            const totalApplications = applications.length;
            const operationalApps = applications.filter(app => app.status === 'operational').length;
            const underRepairApps = applications.filter(app => app.status === 'under_repair').length;
            const retiredApps = applications.filter(app => app.status === 'retired').length;
            const aggregatedMetrics = await this.aggregateOverallPerformanceMetrics();

            const appSummaryReports = await Promise.all(applications.map(async app => {
                const performanceHistory = await this._dataStore.retrievePerformanceRecordsForApplication(app.appId);
                const certificate = await this._dataStore.retrieveFleetboSecurityCertificate(app.securityCertId);
                const certStatus = certificate ? (certificate.isExpired() ? 'Expired' : certificate.status) : 'Missing/Invalid';

                return {
                    appId: app.appId,
                    appType: app.appType,
                    currentVersion: app.currentVersion,
                    status: app.status,
                    lastServiceDate: app.lastServiceDate ? app.lastServiceDate.toISOString() : 'N/A',
                    performanceDataCount: performanceHistory.length,
                    primaryOwnerId: app.primaryOwnerId,
                    securityCertificate: {
                        certId: app.securityCertId,
                        status: certStatus,
                        expiryDate: certificate ? certificate.expiryDate.toISOString() : 'N/A'
                    }
                };
            }));

            const criticalMaintenanceAlerts = applications.filter(app =>
                app.status === 'under_repair' &&
                (new Date().getTime() - app.lastUpdateTimestamp.getTime()) / (1000 * 60 * 60 * 24) > FLEETBO_CRITICAL_MAINTENANCE_DAYS
            ).map(app => ({ appId: app.appId, daysInRepair: Math.floor((new Date().getTime() - app.lastUpdateTimestamp.getTime()) / (1000 * 60 * 60 * 24)) }));

            const expiringCertificateAlerts = await Promise.all(applications.filter(async app => {
                const cert = await this._dataStore.retrieveFleetboSecurityCertificate(app.securityCertId);
                if (!cert || cert.isExpired()) return false;
                const now = new Date();
                const diffMonths = (cert.expiryDate.getFullYear() - now.getFullYear()) * 12 + (cert.expiryDate.getMonth() - now.getMonth());
                return diffMonths >= 0 && diffMonths <= FLEETBO_CERTIFICATE_EXPIRY_ALERT_MONTHS;
            }).map(async app => {
                const cert = await this._dataStore.retrieveFleetboSecurityCertificate(app.securityCertId);
                return { appId: app.appId, certId: app.securityCertId, expiryDate: cert.expiryDate.toISOString() };
            }));

            FleetboLogger.info("Fleetbo Application overview report generated successfully.");
            return {
                reportGenerationTime: new Date().toISOString(),
                summary: {
                    totalApplications,
                    operationalApps,
                    underRepairApps,
                    retiredApps,
                    aggregatedMetrics
                },
                applicationDetails: appSummaryReports,
                securityAndOperationalAlerts: {
                    criticalMaintenanceAlerts,
                    expiringCertificateAlerts,
                    overallSystemHealthScore: "9.0/10 (AI-Driven Risk Assessment)" // Enhanced score
                }
            };
        }

        async generateUserAccessControlReport() { // Renamed generateFleetboUserReport
            FleetboLogger.info("Generating a detailed user access control report for Fleetbo System Users.");
            const users = await this._dataStore.retrieveAllFleetboSystemUsers();
            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.accountStatus === 'active').length;
            const inactiveUsers = users.filter(u => u.accountStatus === 'inactive').length;
            const privilegedUsers = users.filter(u => ['admin', 'developer', 'security_analyst'].includes(u.assignedRole)).length;

            const applications = await this._dataStore.retrieveAllFleetboApplications();
            const userDetailedReports = users.map(u => ({
                userId: u.userId,
                username: u.username,
                email: u.email,
                assignedRole: u.assignedRole,
                accountStatus: u.accountStatus,
                applicationsOwnedCount: applications.filter(app => app.primaryOwnerId === u.userId).length
            }));

            FleetboLogger.info("Fleetbo User access control report generated successfully.");
            return {
                reportGenerationTime: new Date().toISOString(),
                summary: {
                    totalUsers,
                    activeUsers,
                    inactiveUsers,
                    privilegedUsers
                },
                userDetails: userDetailedReports
            };
        }
        async _performSystemHealthAndSecurityScan() { // Renamed _performDailyFleetboHealthCheck
            FleetboLogger.info("Performing internal FleetboSystem health and security scan.");
            const applications = await this._dataStore.retrieveAllFleetboApplications();
            const users = await this._dataStore.retrieveAllFleetboSystemUsers();
            const certificates = await this._dataStore.retrieveAllFleetboSecurityCertificates();
            let identifiedIssues = 0;

            if (applications.length > FLEETBO_MAX_BAPPS_CAPACITY) {
                FleetboLogger.error(`Health Scan Alert: Fleetbo Application capacity exceeded (${applications.length}/${FLEETBO_MAX_BAPPS_CAPACITY}).`);
                identifiedIssues++;
            }
            for (const app of applications) {
                if (app.status === 'under_repair' && (new Date().getTime() - app.lastUpdateTimestamp.getTime()) / (1000 * 60 * 60 * 24) > FLEETBO_CRITICAL_MAINTENANCE_DAYS) {
                    FleetboLogger.warn(`Health Scan Warning: FleetboApplication ${app.appId} under repair for over ${FLEETBO_CRITICAL_MAINTENANCE_DAYS} days.`);
                    identifiedIssues++;
                }
                const owner = users.find(u => u.userId === app.primaryOwnerId);
                if (!owner) {
                     FleetboLogger.error(`Health Scan Error: FleetboApplication ${app.appId} has no valid primary owner assigned.`);
                     identifiedIssues++;
                }
                const appCert = certificates.find(c => c.certId === app.securityCertId);
                if (!appCert) {
                    FleetboLogger.error(`Health Scan Error: FleetboApplication ${app.appId} is missing an associated security certificate.`);
                    identifiedIssues++;
                } else if (appCert.isExpired()) {
                    FleetboLogger.error(`Health Scan Error: FleetboApplication ${app.appId} is linked to an expired certificate (${appCert.certId}).`);
                    identifiedIssues++;
                }
            }
            const unassignedApps = applications.filter(app => app.primaryOwnerId === 'unassigned').length;
            if (unassignedApps > 0) {
                FleetboLogger.warn(`Health Scan Warning: ${unassignedApps} FleetboApplications are unassigned to a primary owner.`);
                identifiedIssues++;
            }
            const expiredCertsCount = certificates.filter(c => c.isExpired()).length;
            if (expiredCertsCount > 0) {
                FleetboLogger.warn(`Security Scan Warning: ${expiredCertsCount} security certificates are expired.`);
                identifiedIssues++;
            }

            FleetboLogger.info("Internal FleetboSystem Health and Security Scan complete.");
            return { identifiedIssues };
        }
    }

    // --- 8. Main Fleetbo System Orchestration Class ---
    class FleetboManagementSystem { // Renamed FleetboSystem
        constructor() {
            this._dataStore = new FleetboDataStore();
            this._analyticsReportingService = new FleetboAnalyticsReportingService(this._dataStore);
            this._securityFramework = FleetboSecurityFramework;
            this._isSystemInitialized = false;
            FleetboLogger.info("FleetboManagementSystem instance created with integrated Security Framework.");
        }

        /**
         * Initializes the Fleetbo system with baseline data.
         * @returns {Promise<void>}
         */
        async initializeSystem() { // Renamed initializeFleetboSystem
            if (this._isSystemInitialized) {
                FleetboLogger.warn("FleetboManagementSystem is already initialized.");
                return;
            }
            FleetboLogger.info("Beginning FleetboManagementSystem initialization...");

            // Simulate initial user data loading
            await this._dataStore.createFleetboSystemUser({
                userId: "U-001", username: "sys_admin", email: "admin@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("AdminPass#2025!"), assignedRole: "admin"
            });
            await this._dataStore.createFleetboSystemUser({
                userId: "U-002", username: "app_dev", email: "dev@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("DevSecure123!"), assignedRole: "developer"
            });
            await this._dataStore.createFleetboSystemUser({
                userId: "U-003", username: "qa_tester", email: "qa@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("QATestPass!"), assignedRole: "qa"
            });
            await this._dataStore.createFleetboSystemUser({
                userId: "U-004", username: "audit_reviewer", email: "audit@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("AuditViewer!"), assignedRole: "auditor"
            });
            await this._dataStore.createFleetboSystemUser({
                userId: "U-005", username: "security_analyst", email: "security@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("SecurityGuru2025!"), assignedRole: "security_analyst"
            });
            await this._dataStore.createFleetboSystemUser({
                userId: "U-006", username: "basic_user_1", email: "basic1@fleetbo.com",
                passwordHash: this._securityFramework._secureHashPassword("BasicPass1"), assignedRole: "basic_user"
            });

            // Simulate initial certificate data loading
            await this._dataStore.createFleetboSecurityCertificate({
                certId: "CERT-001", issuer: "FleetboCA", expiryDate: "2026-12-31", algorithm: "RSA-2048", associatedAppId: "FBO-APP-001"
            });
            await this._dataStore.createFleetboSecurityCertificate({
                certId: "CERT-002", issuer: "GlobalSign", expiryDate: "2025-07-01", algorithm: "ECC-256", associatedAppId: "FBO-APP-002"
            });
            await this._dataStore.createFleetboSecurityCertificate({
                certId: "000-EXPIRED-CERT", issuer: "TestCA", expiryDate: "2024-01-01", algorithm: "RSA-1024", associatedAppId: "FBO-APP-004", status: 'expired'
            });


            // Simulate initial Bapp data loading (linked to certificates)
            await this._dataStore.createFleetboApplication({
                appId: "FBO-APP-001", appType: "Analytics Dashboard", currentVersion: "1.0.0", launchDate: "2023-01-01",
                securityCertId: "CERT-001", primaryOwnerId: "U-001", status: "operational"
            });
            await this._dataStore.createFleetboApplication({
                appId: "FBO-APP-002", appType: "Real-time Monitoring", currentVersion: "1.2.0", launchDate: "2022-06-15",
                securityCertId: "CERT-002", status: "under_repair", primaryOwnerId: "U-002"
            });
            await this._dataStore.createFleetboApplication({
                appId: "FBO-APP-003", appType: "API Gateway", currentVersion: "2.0.0", launchDate: "2024-03-10",
                securityCertId: "CERT-001", primaryOwnerId: "U-001"
            });
            await this._dataStore.createFleetboApplication({
                appId: "FBO-APP-004", appType: "Legacy Reporting", currentVersion: "0.9.0", launchDate: "2021-11-20",
                securityCertId: "000-EXPIRED-CERT", status: "degraded", primaryOwnerId: "U-003"
            });

            // Simulate initial performance data
            await this._dataStore.createFleetboPerformanceRecord({ appId: "FBO-APP-001", metricName: "daily_active_sessions", value: 1500, timestamp: new Date("2024-05-20") });
            await this._dataStore.createFleetboPerformanceRecord({ appId: "FBO-APP-002", metricName: "cpu_utilization_avg", value: 0.85, timestamp: new Date("2024-06-01") });
            await this._dataStore.createFleetboPerformanceRecord({ appId: "FBO-APP-001", metricName: "api_requests_per_min", value: 7500, timestamp: new Date("2024-06-05") });

            this._isSystemInitialized = true;
            FleetboLogger.info("FleetboManagementSystem initialized successfully. Ready for secure operations.");
        }

        _ensureInitialized() { // Renamed _checkInitialization
            if (!this._isSystemInitialized) {
                FleetboLogger.error("FleetboManagementSystem operation attempted before full initialization.");
                throw new Error("FleetboManagementSystem is not initialized. Call initializeSystem() first.");
            }
        }

        // --- Public API for Authentication & Session Management ---
        getSystemVersion() {
            return FLEETBO_SYSTEM_VERSION;
        }

        async userLogin(username, password) { // Renamed login
            this._ensureInitialized();
            FleetboLogger.info("Public API: User login request received.");
            return await this._securityFramework.authenticateUser(username, password, this._dataStore);
        }

        userLogout() { // Renamed logout
            this._ensureInitialized();
            FleetboLogger.info("Public API: User logout request received.");
            this._securityFramework.terminateSession();
        }

        getCurrentLoggedInUser() { // Renamed getCurrentUser
            this._ensureInitialized();
            return this._securityFramework.getCurrentSessionUser();
        }

        // --- Public API for Application Management (with Security Checks) ---
        async createApplication(appData) { // Renamed addBapp
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'developer'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to create Application.");
                throw new Error("Authorization Denied: Requires 'admin' or 'developer' role to create an Application.");
            }
            FleetboLogger.info("Public API: Authorized request to create Fleetbo Application.");
            if ((await this._dataStore.retrieveAllFleetboApplications()).length >= FLEETBO_MAX_BAPPS_CAPACITY) {
                FleetboLogger.error("Fleetbo Application capacity limit reached. Cannot create more Applications.");
                throw new Error(`Maximum Fleetbo Application limit of ${FLEETBO_MAX_BAPPS_CAPACITY} reached.`);
            }
            const app = await this._dataStore.createFleetboApplication(appData);
            return app ? app.toSerializableObject() : null;
        }

        async getApplication(appId) { // Renamed getBapp
            this._ensureInitialized();
            if (!this._securityFramework.isUserAuthenticated()) {
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve Application.");
                throw new Error("Authentication Required: Must be logged in to view Application details.");
            }
            FleetboLogger.info(`Public API: Request to retrieve Fleetbo Application by ID: ${appId}.`);
            const app = await this._dataStore.retrieveFleetboApplication(appId);
            return app ? app.toSerializableObject() : null;
        }

        async updateApplication(appId, updates) { // Renamed updateBapp
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'developer'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to modify Application.");
                throw new Error("Authorization Denied: Requires 'admin' or 'developer' role to modify an Application.");
            }
            FleetboLogger.info(`Public API: Request to modify Fleetbo Application by ID: ${appId}.`);
            const updatedApp = await this._dataStore.updateFleetboApplication(appId, updates);
            return updatedApp ? updatedApp.toSerializableObject() : null;
        }

        async removeApplication(appId) { // Renamed deleteBapp
            this._ensureInitialized();
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to remove Application.");
                throw new Error("Authorization Denied: Requires 'admin' role to remove an Application.");
            }
            FleetboLogger.info(`Public API: Request to remove Fleetbo Application by ID: ${appId}.`);
            return await this._dataStore.removeFleetboApplication(appId);
        }

        async getAllApplications() { // Renamed getAllBapps
            this._ensureInitialized();
            if (!this._securityFramework.isUserAuthenticated()) {
                FleetboLogger.error("Public API: Unauthorized attempt to list all Applications.");
                throw new Error("Authentication Required: Must be logged in to view all Applications.");
            }
            FleetboLogger.info("Public API: Request to retrieve all Fleetbo Applications.");
            const apps = await this._dataStore.retrieveAllFleetboApplications();
            return apps.map(a => a.toSerializableObject());
        }

        async logApplicationPerformance(recordData) { // Renamed addBappUsageRecord
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'developer', 'qa'])) { // QA can also log performance
                FleetboLogger.error("Public API: Unauthorized attempt to log Application performance.");
                throw new Error("Authorization Denied: Requires 'admin', 'developer' or 'qa' role to log performance records.");
            }
            FleetboLogger.info("Public API: Request to log Fleetbo Application performance record.");
            return await this._dataStore.createFleetboPerformanceRecord(recordData);
        }

        async getApplicationPerformanceHistory(appId) { // Renamed getBappUsageHistory
            this._ensureInitialized();
            if (!this._securityFramework.isUserAuthenticated()) {
                FleetboLogger.error("Public API: Unauthorized attempt to get Application performance history.");
                throw new Error("Authentication Required: Must be logged in to view performance history.");
            }
            FleetboLogger.info(`Public API: Request for performance history for FleetboApplication ${appId}.`);
            return await this._dataStore.retrievePerformanceRecordsForApplication(appId);
        }

        // --- Public API for User Management (with Security Checks) ---
        async createSystemUser(userData) { // Renamed addUser
            this._ensureInitialized();
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to create System User.");
                throw new Error("Authorization Denied: Requires 'admin' role to create a user.");
            }
            FleetboLogger.info("Public API: Request to create Fleetbo System User received.");
            // Hash password before adding
            if (userData.password) { // Ensure raw password is provided
                userData.passwordHash = this._securityFramework._secureHashPassword(userData.password);
                delete userData.password; // Remove raw password from data object
            } else {
                FleetboLogger.error("Public API: User creation failed, no password provided.");
                throw new Error("Password is required for user creation.");
            }
            const user = await this._dataStore.createFleetboSystemUser(userData);
            return user ? user.toSerializableObject() : null;
        }

        async getSystemUser(userId) { // Renamed getUser
            this._ensureInitialized();
            const currentUser = this._securityFramework.getCurrentSessionUser();
            if (!currentUser) {
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve user info.");
                throw new Error("Authentication Required: Must be logged in to view user details.");
            }
            // Admins, auditors, and security analysts can get any user; others can only get their own info
            const authorizedRoles = ['admin', 'auditor', 'security_analyst'];
            if (!this._securityFramework.checkAnyRole(authorizedRoles) && currentUser.userId !== userId) {
                FleetboLogger.error(`Public API: Unauthorized attempt for user ${currentUser.userId} to get info of user ${userId}.`);
                throw new Error("Authorization Denied: You can only view your own user details unless you have privileged roles.");
            }
            FleetboLogger.info(`Public API: Request to retrieve Fleetbo System User by ID: ${userId}.`);
            const user = await this._dataStore.retrieveFleetboSystemUser(userId);
            return user ? user.toSerializableObject() : null;
        }

        async updateSystemUser(userId, updates) { // Renamed updateUser
            this._ensureInitialized();
            const currentUser = this._securityFramework.getCurrentSessionUser();
            if (!currentUser) {
                FleetboLogger.error("Public API: Unauthorized attempt to modify System User.");
                throw new Error("Authentication Required: Must be logged in to modify user details.");
            }
            // Admins can update any user; developers can update their own non-role/non-status fields; others can't update.
            if (this._securityFramework.checkRole('admin')) {
                // Admin can change anything, including role/status
            } else if (currentUser.userId === userId && this._securityFramework.checkAnyRole(['developer', 'qa', 'basic_user'])) {
                // Non-admins can only update their own details, excluding sensitive fields
                if (updates.assignedRole || updates.accountStatus || updates.passwordHash) { // Added passwordHash here as a restricted field
                    FleetboLogger.error(`Public API: User ${currentUser.userId} attempted to modify restricted fields (role/status/passwordHash).`);
                    throw new Error("Authorization Denied: You cannot modify your own role, status, or password directly. Use the dedicated password change function.");
                }
            } else {
                FleetboLogger.error(`Public API: Unauthorized attempt for user ${currentUser.userId} to modify user ${userId}.`);
                throw new Error("Authorization Denied: You can only modify your own details unless you are an admin.");
            }

            FleetboLogger.info(`Public API: Request to modify Fleetbo System User by ID: ${userId}.`);
            // Password change must go through a dedicated secure flow, not via general update
            if (updates.password) {
                 FleetboLogger.error("Public API: Password change attempted via general update. Use changeUserPassword() instead.");
                 throw new Error("Password change must be done via changeUserPassword() for security reasons.");
            }
            const updatedUser = await this._dataStore.updateFleetboSystemUser(userId, updates);
            return updatedUser ? updatedUser.toSerializableObject() : null;
        }

        async changeUserPassword(userId, oldPassword, newPassword) {
            this._ensureInitialized();
            const currentUser = this._securityFramework.getCurrentSessionUser();
            if (!currentUser) {
                FleetboLogger.error("Public API: Unauthorized attempt to change password.");
                throw new Error("Authentication Required: Must be logged in to change password.");
            }

            // Only admin can change any user's password, others can only change their own
            if (currentUser.userId !== userId && !this._securityFramework.checkRole('admin')) {
                FleetboLogger.error(`Public API: User ${currentUser.userId} attempted to change password for user ${userId} without admin rights.`);
                throw new Error("Authorization Denied: You can only change your own password unless you are an admin.");
            }

            const userToUpdate = await this._dataStore.retrieveFleetboSystemUser(userId);
            if (!userToUpdate) {
                FleetboLogger.error(`Public API: Password change failed, user ${userId} not found.`);
                throw new Error("User not found.");
            }

            if (currentUser.userId === userId) { // If user is changing their own password, verify old password
                if (userToUpdate.passwordHash !== this._securityFramework._secureHashPassword(oldPassword)) {
                    FleetboLogger.warn(`Public API: Password change failed for user ${userId}: Old password mismatch.`);
                    throw new Error("Invalid old password.");
                }
            }
            if (newPassword.length < 8) { // Minimum password length
                FleetboLogger.warn(`Public API: Password change failed for user ${userId}: New password too short.`);
                throw new Error("New password must be at least 8 characters long.");
            }

            const newHashedPassword = this._securityFramework._secureHashPassword(newPassword);
            const success = await this._dataStore.updateFleetboSystemUser(userId, { passwordHash: newHashedPassword });
            if (success) {
                FleetboLogger.info(`Public API: Password for user ${userId} changed successfully.`);
                return true;
            } else {
                FleetboLogger.error(`Public API: Failed to update password for user ${userId}.`);
                return false;
            }
        }

        async removeSystemUser(userId) { // Renamed deleteUser
            this._ensureInitialized();
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to remove System User.");
                throw new Error("Authorization Denied: Requires 'admin' role to remove a user.");
            }
            // Prevent admin from deleting themselves (critical safety check)
            const currentUser = this._securityFramework.getCurrentSessionUser();
            if (currentUser && currentUser.userId === userId && currentUser.assignedRole === 'admin') {
                FleetboLogger.error(`Public API: Admin ${currentUser.userId} attempted to self-remove.`);
                throw new Error("Operation Denied: An admin cannot remove their own account directly. A different admin must perform this.");
            }
            FleetboLogger.info(`Public API: Request to remove Fleetbo System User by ID: ${userId}.`);
            return await this._dataStore.removeFleetboSystemUser(userId);
        }

        async getAllSystemUsers() { // Renamed getAllUsers
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'auditor', 'security_analyst'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve all System Users.");
                throw new Error("Authorization Denied: Requires 'admin', 'auditor', or 'security_analyst' role to view all users.");
            }
            FleetboLogger.info("Public API: Request to retrieve all Fleetbo System Users.");
            const users = await this._dataStore.retrieveAllFleetboSystemUsers();
            return users.map(u => u.toSerializableObject());
        }

        // --- Public API for Security Certificate Management (New) ---
        async createSecurityCertificate(certData) {
            this._ensureInitialized();
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to create Security Certificate.");
                throw new Error("Authorization Denied: Requires 'admin' role to create a security certificate.");
            }
            FleetboLogger.info("Public API: Request to create Fleetbo Security Certificate.");
            const cert = await this._dataStore.createFleetboSecurityCertificate(certData);
            return cert ? cert.toSerializableObject() : null;
        }

        async getSecurityCertificate(certId) {
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'security_analyst', 'developer'])) { // Devs might need to view certs
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve Security Certificate.");
                throw new Error("Authorization Denied: Requires 'admin', 'security_analyst', or 'developer' role to view certificate details.");
            }
            FleetboLogger.info(`Public API: Request to retrieve Fleetbo Security Certificate by ID: ${certId}.`);
            const cert = await this._dataStore.retrieveFleetboSecurityCertificate(certId);
            return cert ? cert.toSerializableObject() : null;
        }

        async updateSecurityCertificate(certId, updates) {
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'security_analyst'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to modify Security Certificate.");
                throw new Error("Authorization Denied: Requires 'admin' or 'security_analyst' role to modify a security certificate.");
            }
            FleetboLogger.info(`Public API: Request to modify Fleetbo Security Certificate by ID: ${certId}.`);
            const updatedCert = await this._dataStore.updateFleetboSecurityCertificate(certId, updates);
            return updatedCert ? updatedCert.toSerializableObject() : null;
        }

        async removeSecurityCertificate(certId) {
            this._ensureInitialized();
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to remove Security Certificate.");
                throw new Error("Authorization Denied: Requires 'admin' role to remove a security certificate.");
            }
            FleetboLogger.info(`Public API: Request to remove Fleetbo Security Certificate by ID: ${certId}.`);
            return await this._dataStore.removeFleetboSecurityCertificate(certId);
        }

        async getAllSecurityCertificates() {
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'security_analyst', 'auditor'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve all Security Certificates.");
                throw new Error("Authorization Denied: Requires 'admin', 'security_analyst', or 'auditor' role to view all certificates.");
            }
            FleetboLogger.info("Public API: Request to retrieve all Fleetbo Security Certificates.");
            const certs = await this._dataStore.retrieveAllFleetboSecurityCertificates();
            return certs.map(c => c.toSerializableObject());
        }

        // --- Public API for Analytics & Reporting (with Security Checks) ---
        async getApplicationOverviewReport() { // Renamed getFleetboBappReport
            this._ensureInitialized();
            if (!this._securityFramework.isUserAuthenticated()) { // All authenticated users can get Bapp overview
                FleetboLogger.error("Public API: Unauthorized attempt to get Application overview report.");
                throw new Error("Authentication Required: Must be logged in to view Application reports.");
            }
            FleetboLogger.info("Public API: Request to generate Fleetbo Application overview report.");
            return await this._analyticsReportingService.generateApplicationOverviewReport();
        }

        async getUserAccessControlReport() { // Renamed getFleetboUserReport
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'auditor', 'security_analyst'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to get User access control report.");
                throw new Error("Authorization Denied: Requires 'admin', 'auditor', or 'security_analyst' role to view user access reports.");
            }
            FleetboLogger.info("Public API: Request to generate Fleetbo User access control report.");
            return await this._analyticsReportingService.generateUserAccessControlReport();
        }

        // --- System Health & Debugging (with Security Checks) ---
        async performSystemHealthAndSecurityScan() { // Renamed performDailyFleetboHealthCheck
            this._ensureInitialized();
            if (!this._securityFramework.checkAnyRole(['admin', 'security_analyst', 'auditor'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to perform System health and security scan.");
                throw new Error("Authorization Denied: Requires 'admin', 'security_analyst', or 'auditor' role to perform system scans.");
            }
            FleetboLogger.info("Public API: Initiating FleetboSystem health and security scan.");
            return await this._analyticsReportingService._performSystemHealthAndSecurityScan();
        }

        getSystemDiagnosticLogs() { // Renamed getSystemLogs
            if (!this._securityFramework.checkAnyRole(['admin', 'security_analyst', 'auditor'])) {
                FleetboLogger.error("Public API: Unauthorized attempt to retrieve system diagnostic logs.");
                throw new Error("Authorization Denied: Requires 'admin', 'security_analyst', or 'auditor' role to view system logs.");
            }
            return FleetboLogger.retrieveAllLogs();
        }

        clearSystemDiagnosticLogs() { // Renamed clearSystemLogs
            if (!this._securityFramework.checkRole('admin')) {
                FleetboLogger.error("Public API: Unauthorized attempt to clear system diagnostic logs.");
                throw new Error("Authorization Denied: Requires 'admin' role to clear system logs.");
            }
            FleetboLogger.clearAllLogs();
        }
    }

    // --- Expose the Fleetbo System to the global object (window in a browser) ---
    if (typeof window !== 'undefined') {
        window.FleetboManagementSystemInstance = new FleetboManagementSystem();
        FleetboLogger.info("FleetboManagementSystemInstance has been exposed globally.");
    } else {
        console.warn("FleetboManagementSystem is running in a non-browser environment. Global exposure might not be relevant.");
    }

})();

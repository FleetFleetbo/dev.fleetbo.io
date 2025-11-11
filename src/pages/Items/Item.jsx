/**
 * === Fleetbo Developer Tutorial: A Detail Page (Item.jsx) ===
 *
 * This file is an example of a "detail" page that displays a single item.
 * It is designed to work with dynamic routing and the native bridge.
 *
 * 1. useParams:
 * Uses the `useParams` hook from React Router to read the item's ID
 * directly from the URL (e.g., /item/ID-123).
 *
 * 2. Data Fetching (`useEffect`):
 * Uses `await Fleetbo.getDoc(...)` with the URL's ID to
 * securely fetch a single document from Firestore.
 *
 * 3. Native Navigation (`Fleetbo.back`):
 * The "Back" button does not use React Router. It calls `Fleetbo.back()`,
 * asking the native container to handle the back navigation,
 * which is more reliable on mobile.
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { fleetboDB } from 'config/fleetboConfig';
import Loader from 'components/common/Loader'; 
import { ArrowLeftCircle } from 'lucide-react'; 


const ItemHeader = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <div>
                <button onClick={() => Fleetbo.back()} className="btn-header text-success fs-5 fw-bold">
                    <ArrowLeftCircle/> <span className='ms-3'>Item</span>
                </button>
            </div>
        </header>
    );
};

const Item = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const { id } = useParams(); 

    useEffect(() => {
        const fetchData = async (itemId) => {
            setLoading(true);
            setError("");
            
            if (!itemId) {
                setError("No item ID was provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await Fleetbo.getDoc(fleetboDB, "items", itemId);

                if (response.success && response.data) {
                    setItemData(response.data);
                } else {
                    const errorMessage = response.message || "Error fetching the document.";
                    setError(errorMessage);
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error fetching item:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData(id);

    }, [id]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className='center-container'>
                    <Loader />
                </div>
            );
        }

        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }

        if (itemData) {
            return (
                <div>
                    <h2>{itemData.title}</h2>
                    <h5 className='fw-normal text-secondary'>{itemData.content}</h5>
                </div>
            );
        }

        return <p>No data found for this item.</p>;
    };

    return (
        <>
            <ItemHeader />
            <div className="p-3">
                {renderContent()}
            </div>
        </>
    );
};

export default Item;

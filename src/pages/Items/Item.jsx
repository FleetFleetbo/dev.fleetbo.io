import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo'; 
import { fleetboDB } from 'config/fleetboConfig';
import PageConfig from 'components/common/PageConfig';


const ItemHeader = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <div>
                <button onClick={() => Fleetbo.back()} className="btn-header text-success fs-5 fw-bold">
                    <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Item</span>
                </button>
            </div>
        </header>
    );
};

const Item = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // This function will be called by the native side with the item ID
        window.getParam = (id) => {
            if (id) {
                // Assuming fleetboDB is available in this scope
                Fleetbo.getDoc(fleetboDB, "items", id);
            } else {
                setError("No item ID was provided.");
                setLoading(false);
            }
        };

        // Set up the callback to receive data from the native side
        Fleetbo.setDataCallback((response) => {
            if (response.success && response.data) {
                setItemData(response.data);
            } else {
                const errorMessage = response.message || "Error fetching the document.";
                setError(errorMessage);
            }
            setLoading(false);
        });

        // Cleanup function to remove global functions when the component unmounts
        return () => {
            delete window.getParam;
            Fleetbo.setDataCallback(null); // Clear the callback
        };
    }, []); // Empty dependency array ensures this runs only once on mount

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
            <PageConfig navbar="hidden" /> 
            <ItemHeader />
            <div className="p-3">
                {renderContent()}
            </div>
        </>
    );
};

export default Item;

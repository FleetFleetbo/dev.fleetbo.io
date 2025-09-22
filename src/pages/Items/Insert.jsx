
import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo'; 
import { fleetboDB } from 'config/fleetboConfig';
import {  Link  } from 'react-router-dom';
import PageConfig from 'components/common/PageConfig';


const Insert = () => {
    
    const  db                                     = "items";
    const [loading,  setLoading]                  = useState();
    const [resultMessage, setResultMessage]       = useState();
    const [messageType, setMessageType]           = useState(''); 
    const [imageURL, setImageURL]                 = useState("");
    const [token, setToken]                       = useState('');
    const [formData, setFormData]                 = useState({
        id: "", // Mandatory: id: "uid" or id: id or id: "" / "null"
        title: "",
        content: "",
        image: ""
        // No need to store current date. Automatic
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        window.displayImage = (escapedImageBase64) => {
            try {
                const decodedImageBase64 = decodeURIComponent(escapedImageBase64); 
                setImageURL(decodedImageBase64);
                setFormData((prevData) => ({
                    ...prevData,
                    image: decodedImageBase64,
                }));
            } catch (error) {
                console.error("Error decoding image:", error);
            }
        };
        return () => {
            window.displayImage = undefined;   delete window.getToken;
        };
    }, []);

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        setResultMessage("");
        setMessageType("");
    
        if (!formData.title || !formData.content) {
            setLoading(false);
            setResultMessage('Required fields');
            setMessageType('danger');
            return;
        }
    
        // 1. We only prepare the text data for submission.
        // We send the complete formData object.
        const jsonData = JSON.stringify(formData);
    
        // 2. We call a new Fleetbo function that tells the native side
        //    to add this text data WITH the last selected image.
        //    The native side will handle the upload and linking of the URL.
        Fleetbo.add(fleetboDB, db, jsonData);
    
        // 3. Get the device token to send a notification.
        Fleetbo.getToken();
        window.getToken = (deviceToken) => {
            setToken(deviceToken);
        };
        const notificationData = {
            title: formData.title,
            body: formData.content,
            token: token,
            image: ""
        };
        const jsonDataNotification = JSON.stringify(notificationData);
        // The notification is also handled by the native side after the operation's success.
        Fleetbo.startNotification(jsonDataNotification);
    };

    window.onAddResult = (success) => {
        setLoading(false); 
        if (success) {
            setResultMessage('✅ Added successfully.');
            setMessageType('success');
            setFormData({ id: "", title: "", content: "", image: "" });
            setImageURL("");
        } else {
            setResultMessage("❌ Sending error.");
            setMessageType('danger');
        }
    };
    
    
    return (
        <>
            <PageConfig navbar="hidden" />
            <header className='navbar p-3'> 
                <div className=''> 
                    <button onClick={() => Fleetbo.back() }  className="btn-header text-success fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Insert </span>
                    </button>
                </div>
                <div className="navbar-right">
                    <button onClick={() => Fleetbo.openGalleryView() }  className="btn-header fs-5 text-success fw-bold">
                         <i className="fa-solid fs-5 fa-image"></i>
                    </button>
                </div>
            </header>

            <div className="p-3" >
                <div className="p-2 mt-2">          
                    <form onSubmit={handleSubmit} >
                                  
                        <div className='mt-3 mb-3'>
                            <div className='mt-1'>
                                <h3 className="float-start fw-bolder text-dark" style={{ fontFamily: 'arial' }}>
                                    Add item 
                                </h3>
                            </div>
                        </div>
                        <br /> <br />

                                       
                        <div className="mt-3 mb-4" style={{ width: '100%' }}>
                            <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{
                                    width: '100px',
                                    height: '90px',
                                    borderRadius: '9%',
                                    position: 'relative',
                                }}
                            >
                                {/* Image */}
                                <img
                                    id="imageView"
                                    src={imageURL || `${process.env.PUBLIC_URL}/logo512.png`}
                                    alt="default"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '9%',
                                        objectFit: 'cover', 
                                    }}
                                />
       
                                    {/* Gallery photo  */}
                                    <Link
                                        onClick={() => Fleetbo.openGalleryView() } 
                                        style={{
                                            position: 'absolute',
                                            bottom: '1px',
                                            right: '1px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: '20%',
                                            padding: '7px',
                                            paddingLeft: '13px',
                                            paddingRight: '13px',
                                            color: '#fff',
                                        }}
                                    >
                                        <i className="fa fa-camera" style={{ fontSize: '17px' }}></i>
                                    </Link>
                            </div>
                        </div>
  
                        <div className="mb-3">
                            <label className="float-start fs-5 mb-2">Title</label>
                            <input
                                type='text'
                                className="form-control input"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                           
                            />
                        </div>
       
                        <div className="mb-3">
                            <label className="float-start fs-5 mb-2">Description</label>
                            <textarea
                                type="text"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="form-control input"
                                rows={4}
                                           
                            >
                            </textarea>
                        </div>
       
                        <button
                                className="btn btn-success w-100 p-2 fs-5 mt-3" 
                                onClick={handleSubmit} 
                                type="submit"
                                disabled={loading}
                        >
                                {loading ? 'Loading...' : 'Add'} 
                        </button>
                        <div className="text-success fw-normal mt-1" style={{ height: '20px'}}>
                                {resultMessage && (
                                    <div className={`input-box mt-3 fs-6 text-${messageType === 'success' ? 'success' : 'danger'}`}>
                                        {resultMessage}  
                                    </div>
                                )}
                        </div>
       
                    </form>
                </div>
          
            </div>
        </>
    );
};

export default Insert;


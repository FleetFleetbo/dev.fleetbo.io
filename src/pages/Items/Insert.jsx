
import React, { useEffect, useState } from 'react';
import { fleetboDB } from 'config/fleetboConfig';
import {  Link  } from 'react-router-dom';
import PageConfig from 'components/common/PageConfig';
import { ArrowLeftCircle, Images} from 'lucide-react'; 

const Insert = () => {
    
    const  db                                     = "items";
    const [loading,  setLoading]                  = useState();
    const [resultMessage, setResultMessage]       = useState();
    const [messageType, setMessageType]           = useState(''); 
    const [imageURL, setImageURL]                 = useState("");
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
        const handleMessage = (event) => {
            if (event.data.type === 'INJECT_IMAGE') {
                try {
                    const imageBase64 = event.data.imageBase64;
                    setImageURL(imageBase64);
                    setFormData((prevData) => ({
                        ...prevData,
                        image: imageBase64,
                    }));
                } catch (error) {
                    console.error("Error receiving injected image:", error);
                }
            }
        };

        window.displayImage = (escapedImageBase64) => {
            try {
                const decodedImageBase64 = escapedImageBase64
                    .replace(/\\n/g, '\n')
                    .replace(/\\'/g, "'")
                    .replace(/\\\\/g, '\\');

                setImageURL(decodedImageBase64);
                setFormData((prevData) => ({
                    ...prevData,
                    image: decodedImageBase64,
                }));
            } catch (error) {
                console.error("Error decoding native image:", error);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
            window.displayImage = undefined;
        };
    }, []); 

    const handleSubmit = async (e) => { 
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
    
        const jsonData = JSON.stringify(formData);

        try {

            await Fleetbo.add(fleetboDB, db, jsonData);

            setLoading(false);
            setResultMessage(' Added successfully.');
            setMessageType('success');
            setFormData({ id: "", title: "", content: "", image: "" });
            setImageURL("");

            const tokenResult = await Fleetbo.getToken();

            const notificationData = {
                title: formData.title,
                body: formData.content,
                token: tokenResult.token, 
                image: ""
            };
            const jsonDataNotification = JSON.stringify(notificationData);

            Fleetbo.startNotification(jsonDataNotification);

        } catch (error) {
            setLoading(false);
            setResultMessage(`Sending error: ${error.message}`);
            setMessageType('danger');
        }
    };
    
    return (
        <>
            <PageConfig navbar="none" />
            <header className='navbar p-3'> 
                <div className=''> 
                    <button onClick={() => Fleetbo.back() }  className="btn-header text-success fs-5 fw-bold">
                        <ArrowLeftCircle/> <span className='ms-3'>Insert </span>
                    </button>
                </div>
                <div className="navbar-right">
                    <button onClick={() => Fleetbo.openGalleryView() }  className="btn-header fs-5 text-success fw-bold">
                         <Images />
                    </button>
                </div>
            </header>

            <div className="p-3" >
                <div className="p-2 mt-2">          
                    <form onSubmit={handleSubmit} >
                                       
                        <div className="mt-3 mb-4" style={{ width: '100%' }}>
                            <div
                                className="bg-light d-flex align-items-center justify-content-center"
                                style={{
                                    width: '75px',
                                    height: '70px',
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



import React, { useState } from 'react';
import Fleetbo from 'systemHelper';
import { fleetboDB } from 'db';


const Insert = () => {
    
    const [loading,  setLoading]                = useState();
    const [formData, setFormData]               = useState({
            title: "",
            content: "",
            // No need to store current date. Automatic
    });

    const  db                                   = "items";
    const [resultMessage, setResultMessage]     = useState();
    const [messageType, setMessageType]         = useState(''); // 'success' or 'error'


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
        
        const jsonData   = JSON.stringify(formData);

        // Insertion
        setTimeout(() => {
            Fleetbo.adn9991(fleetboDB, db, jsonData);
            setFormData({ title: "", content: "" });
            setLoading(false);
        }, 1000);
    };

    window.onAddResult = (success) => {
        if (success) {
            setResultMessage('✅ Added successfully.');
            setMessageType('success');
            return;
        } else {
            setResultMessage("❌ Sending error.");
            setMessageType('danger');
            return;
        }
    };
    

    return (
        <>
            <header className='navbar pt-4'> 
                <div className=''> 
                    <button onClick={() => Fleetbo.back() }  className="logout fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Insert</span>
                    </button>
                </div>
                <div className="navbar-right">
                    <button onClick={() => Fleetbo.openGalleryView() }  className="logout fw-bold">
                         <i className="fa-solid fs-5 fa-image"></i>
                    </button>
                </div>
            </header>

            {/* Container avec gestion du loader */}
            <div className="p-3" >
        
                <div className="p-2 mt-2">          
                    <form onSubmit={handleSubmit} >
                                  
                        <div className='mb-3'>
                            <div className='mt-1'>
                                <h3 className="float-start fw-bolder text-success" style={{ fontFamily: 'tahoma' }}>
                                    Add item
                                </h3>
                            </div>
                        </div>
                        <br /> <br />
  
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
                                className="go mt-2 mb-2 fw-bold" 
                                onClick={handleSubmit} 
                                type="submit"
                                disabled={loading}
                        >
                                {loading ? 'Loading...' : 'Add'} 
                        </button>
                        <div className="text-success fw-normal mt-1" style={{ height: '20px'}}>
                                {/* Result Message */}
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


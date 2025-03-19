import React, { useEffect, useState } from 'react';


const Not = () => {


	const [loadpage, setLoadPage]   = useState(true); 
	
	useEffect(() => {
		setTimeout(() => {  setLoadPage(false); }, 1300);   
	}, [loadpage]);

    return (
    <>
	{/* Container avec gestion du loader */}
		<div className="container">
		{loadpage ? (
		<div className="parent-container">
			<div className="loader"></div>
		</div>
		) : (
		<>
		<div className="parent-container">
			<h6 className="text-secondary fw-normal">Not found.</h6>
		</div>
		</>
		)}
		</div>		
	 </>

    )
};

export default Not;

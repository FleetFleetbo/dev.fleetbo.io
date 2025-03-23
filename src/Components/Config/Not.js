import React, { useEffect } from 'react';


const Not = () => {

	useEffect(() => {
		setTimeout(() => {  }, 1000);   
	}, []);

    return (
    <>
	{/* Container avec gestion du loader */}
		<div className="center-container">
			<div className="container">
				<h6 className="text-dark fw-normal">Not found.</h6>
			</div>
		</div>		
	 </>

    )
};

export default Not;

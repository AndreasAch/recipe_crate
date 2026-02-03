import { Hourglass } from "ldrs/react";

const LoadingOverlay = () => (
	<div style={{ 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        width:"100%",
        minHeight: "400px",
        paddingTop: "20px",
        }}>
		<Hourglass size="80" bgOpacity="0.1" speed="1.75" color="#2ecc71" />
	</div>
);

export default LoadingOverlay;

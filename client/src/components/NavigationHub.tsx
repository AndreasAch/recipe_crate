import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CiGrid41, CiCirclePlus, CiSearch } from "react-icons/ci";
import logoAsset from "../assets/recipeCrateLogo.png";
import "../styles/NavigationHub.css";

const NavigationHub = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const [, setHubSize] = useState({ width: 80, height: 80 });
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (containerRef.current) {
			const { offsetWidth, offsetHeight } = containerRef.current;
			setHubSize({ width: offsetWidth, height: offsetHeight });
		}
	}, []);

	const menuItems = [
		{ icon: <CiGrid41 size={34} />, label: "Roster", path: "/roster/list" },
		{ icon: <CiCirclePlus size={34} />, label: "Add", path: "/add" },
		{ icon: <CiSearch size={34} />, label: "Lookup", path: "/discover" },
	];

	const shakeVariants: Variants = {
		idle: {
			rotate: [0, -3, 3, -3, 3, 0, 0, 0, 0, 0],
			transition: {
				duration: 2.5,
				repeat: Infinity,
				ease: "easeInOut",
				repeatDelay: 0.5,
			},
		},
		active: {
			rotate: 0,
			scale: 1.1,
			transition: { duration: 0.2 },
		},
	};

	const toggleMenu = () => setIsOpen(!isOpen);

	const calculatePosition = (index: number) => {
		const totalItems = menuItems.length;
		const arcDegrees = 120;
		const startAngle = 180 + (180 - arcDegrees) / 2;

		const angle = totalItems > 1 ? startAngle + index * (arcDegrees / (totalItems - 1)) : 270;
		const distance = 121;

		const x = Math.cos(angle * (Math.PI / 180)) * distance;
		const y = Math.sin(angle * (Math.PI / 180)) * distance;

		return { x, y };
	};

	return (
		<div className="hub-container">
			<div className="hub-divider-bg" />
			<AnimatePresence>
				{isOpen && (
					<div className="hub-menu-overlay">
						{menuItems.map((item, index) => {
							const { x, y } = calculatePosition(index);
							return (
								<motion.button
									key={index}
									className="hub-child-btn"
									initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: -180 }}
									animate={{
										opacity: 1,
										scale: 1,
										x,
										y,
										rotate: 0,
									}}
									exit={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 180 }}
									transition={{
										type: "spring",
										stiffness: 320,
										damping: 23,
										delay: index * 0.08,
									}}
									onClick={() => {
										navigate(item.path);
										setIsOpen(false);
									}}
								>
									{item.icon}
									<span className="hub-btn-label">{item.label}</span>
								</motion.button>
							);
						})}
					</div>
				)}
			</AnimatePresence>

			<motion.div
				ref={containerRef}
				className={`hub-main-logo ${isOpen ? "active" : ""}`}
				onClick={toggleMenu}
				whileTap={{ scale: 0.9 }}
				animate={isOpen ? "active" : "idle"}
				variants={shakeVariants}
			>
				<img src={logoAsset} alt="Logo" className="hub-logo-img" />
			</motion.div>
		</div>
	);
};

export default NavigationHub;

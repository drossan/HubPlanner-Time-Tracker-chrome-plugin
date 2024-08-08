import { Dispatch, ReactNode, SetStateAction } from "react";

import Footer from "@ui/components/Footer";
import Header from "@ui/components/Header";
import Loader from "@ui/components/Loader";

type LayoutAppProps = {
	apiToken: string;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
};

const LayoutApp = ({
	apiToken,
	setIsLoggedIn,
	loading,
	setLoading,
	children,
}: LayoutAppProps) => {
	return (
		<>
			<Header
				apiToken={apiToken}
				setIsLoggedIn={setIsLoggedIn}
				setLoading={setLoading}
			/>
			{loading && <Loader />}
			{children}
			<Footer />
		</>
	);
};

export default LayoutApp;

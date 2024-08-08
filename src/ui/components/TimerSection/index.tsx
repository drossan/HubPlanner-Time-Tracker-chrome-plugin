import {
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
	useCallback,
} from "react";

import useReloadData from "@hooks/useReloadDatabase.ts";
import {
	Categories,
	DataTypesReloadData,
	Projects,
	TimeEntryAdd,
} from "@projectTypes";
import AutocompleteInput from "@ui/components/AutocompleteInput";
import IconButtonWithTooltip from "@ui/components/IconButtonWithTooltip";

interface TimerSectionProps {
	apiToken: string;
	projects: Projects;
	categories: Categories;
	selectedProject: string | null;
	setSelectedProject: (project: string | null) => void;
	selectedCategory: string | null;
	setSelectedCategory: (category: string | null) => void;
	startTime: Date | null;
	setStartTime: (startTime: Date | null) => void;
	timerInterval: NodeJS.Timeout | null;
	setTimerInterval: (
		timerInterval: ReturnType<typeof setInterval> | null,
	) => void;
	tab: number;
	setTab: (number: number) => void;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

const TimerSection = ({
	apiToken,
	projects,
	categories,
	selectedProject,
	setSelectedProject,
	selectedCategory,
	setSelectedCategory,
	startTime,
	setStartTime,
	timerInterval,
	setTimerInterval,
	tab,
	setTab,
	setLoading,
}: TimerSectionProps) => {
	const [timer, setTimer] = useState<string>("00:00");
	const [timerSeconds, setTimerSeconds] = useState<string>("00");
	const [message, setMessage] = useState<string>("");
	const reloadData = useReloadData();

	useEffect(() => {
		if (startTime) {
			const interval = setInterval(updateTimer, 1000);
			setTimerInterval(interval);
		}
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	}, [startTime]);

	const updateTimer = useCallback(() => {
		if (startTime) {
			const now = new Date();
			const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
			const hours = Math.floor(elapsed / 3600);
			const minutes = Math.floor((elapsed % 3600) / 60);
			const seconds = elapsed % 60;
			setTimer(
				`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
			);
			setTimerSeconds(`${String(seconds).padStart(2, "0")}`);
		}
	}, [startTime]);

	const handleStartStop = async () => {
		if (startTime) {
			clearInterval(timerInterval!);
			const endTime = new Date();
			const duration = Math.round(
				(endTime.getTime() - startTime.getTime()) / (1000 * 60),
			);
			setTimer("00:00");
			setTimerSeconds("00");

			const timeEntry: TimeEntryAdd = {
				project: selectedProject!,
				categoryTemplateId: selectedCategory!,
				date: new Date().toISOString().split("T")[0],
				minutes: duration,
			};

			setLoading(true);

			try {
				reloadData({
					apiToken: apiToken,
					action: DataTypesReloadData.ADD_TASK,
					body: timeEntry,
				}).then(() => {
					setMessage("Entrada de tiempo registrada con éxito");
				});

				reloadData({
					apiToken: apiToken,
					action: DataTypesReloadData.RECENT_TASK,
				}).finally(() => {
					setLoading(false);
					setStartTime(null);
				});
			} catch (error) {
				setLoading(false);
				setMessage("Fallo al registrar la entrada de tiempo");
			}

			handleClearForm();
		} else {
			setStartTime(new Date());
			const interval = setInterval(updateTimer, 1000);
			setTimerInterval(interval);
		}
	};

	const handleClearForm = () => {
		setSelectedProject(null);
		setSelectedCategory(null);
		setStartTime(null);
		setTimer("00:00");
		setTimerSeconds("00");
		setMessage("");
		chrome.storage.sync.remove([
			"selectedProject",
			"selectedCategory",
			"startTime",
		]);
	};

	return (
		<section className="mt-20 px-4 my-2 mx-4 bg-white border rounded">
			<div
				className="my-4 flex justify-between items-center cursor-pointer"
				onClick={() => setTab(1)}
			>
				<div className="flex items-center gap-x-2">
					<img src="/images/timer.png" alt="timer" width="16px" />
					<span className="text-sm font-medium">Temporizador</span>
				</div>
				<IconButtonWithTooltip
					onClick={handleClearForm}
					image="images/reload.png"
					alt="Clear form"
					width="16px"
					tooltip="Resetea el formulario"
				/>
			</div>
			<div className={tab !== 1 ? "hidden" : ""}>
				<div className="my-4">
					<AutocompleteInput
						items={projects}
						selectedItem={selectedProject}
						onSelectItem={(value) => {
							setSelectedProject(value);
							chrome.storage.sync.set({ selectedProject: value });
						}}
						placeholder="Selecciona un proyecto..."
					/>
				</div>
				<div className="my-4">
					<AutocompleteInput
						items={categories}
						selectedItem={selectedCategory}
						onSelectItem={(value) => {
							setSelectedCategory(value);
							chrome.storage.sync.set({ selectedCategory: value });
						}}
						placeholder="Selecciona una categoría..."
					/>
				</div>

				<div className="flex justify-between items-center my-8 relative ">
					<button
						onClick={handleStartStop}
						className={`py-3 px-6 ${startTime ? "bg-red-500" : selectedProject && selectedCategory ? "bg-green-500" : "bg-gray-300"} text-white rounded-full flex items-center justify-center`}
					>
						<img
							src={`./images/${startTime ? "stop" : "play"}.png`}
							alt="Play"
							className="w-4 h-4 mr-2"
						/>
						<span className="text-lg">{startTime ? "Parar" : "Iniciar"}</span>
					</button>
					<span className="text-5xl text-neutral-700 font-extralight z-10">
						{timer}
					</span>
					<span className="text-8xl text-gray-100 font-light absolute -end-5 z-0">
						{timerSeconds}
					</span>
				</div>
				<div id="message" className="my-2 text-center">
					{message}
				</div>
			</div>
		</section>
	);
};

export default TimerSection;

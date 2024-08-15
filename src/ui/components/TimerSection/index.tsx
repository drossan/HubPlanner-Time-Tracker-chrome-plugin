import Icon from "@mdi/react";
import Dialog from "@ui/components/Dialog";
import TitleTab from "@ui/components/TitleTab";
import {
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
	useCallback,
} from "react";

import { mdiReload, mdiTimerOutline, mdiPlay, mdiStop } from '@mdi/js';

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
	indexTab: number;
	setTab: (number: number) => void;
	setLoading: Dispatch<SetStateAction<boolean>>;
	note: string | null;
	setNote: Dispatch<SetStateAction<string | null>>;
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
	indexTab,
	setTab,
	setLoading,
	note,
	setNote
}: TimerSectionProps) => {

	console.log({
		note: note
	})

	const [timer, setTimer] = useState<string>("00:00");
	const [timerSeconds, setTimerSeconds] = useState<string>("00");
	const [message, setMessage] = useState<string>("");
	const [startTimer, setStartTimer] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const reloadData = useReloadData();

	const formatTime = (value: number) => String(value).padStart(2, "0");

	const updateTimer = useCallback(() => {
		if (startTime) {
			const now = Date.now();
			const elapsed = Math.floor((now - startTime.getTime()) / 1000);

			const hours = Math.floor(elapsed / 3600);
			const minutes = Math.floor((elapsed % 3600) / 60);
			const seconds = elapsed % 60;

			setTimer(`${formatTime(hours)}:${formatTime(minutes)}`);
			setTimerSeconds(formatTime(seconds));
		}
	}, [startTime]);

	useEffect(() => {
		updateTimer()
		if (startTime && !startTimer) {
			setStartTimer(true)
		}
	}, [startTime]);

	useEffect(() => {
		if (startTime && !timerInterval) {
			const interval = setInterval(updateTimer, 1000);
			setTimerInterval(interval);
		}
		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	}, [startTimer]);

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
				note,
			};

			setLoading(true);

			try {
				reloadData({
					apiToken: apiToken,
					action: DataTypesReloadData.ADD_TASK,
					body: timeEntry,
				}).then(() => {
					setMessage("Entrada de tiempo registrada con éxito");

					reloadData({
						apiToken: apiToken,
						action: DataTypesReloadData.RECENT_TASK,
					}).finally(() => {
						setLoading(false);
						setStartTime(null);
					});
				});


			} catch (error) {
				setLoading(false);
				setMessage("Fallo al registrar la entrada de tiempo");
			}

			handleClearForm();
		} else {
			setStartTime(new Date());
			setStartTimer(true)
		}
	};

	const handleClearForm = () => {
		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
		setSelectedProject(null);
		setSelectedCategory(null);
		setNote(null);
		setStartTime(null);
		setTimer("00:00");
		setStartTimer(false);
		setTimerSeconds("00");
		setMessage("");
		chrome.storage.sync.remove([
			"selectedProject",
			"selectedCategory",
			"note",
			"startTime",
		]);

		handleCancel()
	};

	const handleOpen = () => {
		setIsDialogOpen(true);
	};

	const handleCancel = () => {
		setIsDialogOpen(false);
	};

	return (
		<section className="mt-20 px-4 my-1 mx-4 bg-white border rounded">
			<div
				className="cursor-pointer my-2 flex justify-between items-center titleTab"
				onClick={() => setTab(tab !== indexTab ? indexTab : 0)}
			>
				<TitleTab
					tab={tab}
					indexTab={indexTab}
					iconPath={mdiTimerOutline}
					text="Temporizador"
				/>

				{
					tab === indexTab
						? (
							<>
								<IconButtonWithTooltip
									onClick={startTime ? handleOpen : handleClearForm}
									iconPath={mdiReload}
									tooltip="Resetea el formulario"
								/>
								<Dialog
									isOpen={isDialogOpen}
									title="¿Estás seguro?"
									message="Todo el progreso se perderá. ¿Deseas continuar?"
									onConfirm={handleClearForm}
									onCancel={handleCancel}
								/>
							</>

						) : (
							<div>
								<span className="text-xs font-light">{timer}</span>
								<span className="text-xs text-gray-400 font-light">:{timerSeconds}</span>
							</div>
						)
				}

			</div>
			<div className={tab !== 1 ? "hidden" : ""}>
				<div className="my-4">
					<AutocompleteInput
						items={projects}
						selectedItem={selectedProject}
						onSelectItem={(value) => {
							setSelectedProject(value);
							chrome.storage.sync.set({selectedProject: value});
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
							chrome.storage.sync.set({selectedCategory: value});
						}}
						placeholder="Selecciona una categoría..."
					/>
				</div>

				<div className="my-4">
					<textarea
						name="note"
						className="w-full p-2 border border-gray-300 rounded outline-none hover:border-green-500 focus:border"
						rows={2}
						placeholder="Nota"
						value={note || ""}
						onChange={e => {
							console.log({
								note_click: "e.target.value"
							})
							setNote(e.target.value);
							chrome.storage.sync.set({note: e.target.value});
						}}
					></textarea>
				</div>

				<div className="flex justify-between items-center my-6 relative ">
					<button
						onClick={handleStartStop}
						className={`py-2 px-6 ${startTime ? "bg-red-500" : selectedProject && selectedCategory ? "bg-green-500" : "bg-gray-300"} text-white rounded-full flex items-center justify-center`}
					>
						{
							startTime
								? (	<Icon path={mdiStop} size={1} className="text-white mr-2" />)
								: (	<Icon path={mdiPlay} size={1} className="text-white mr-2" />)
						}
						<span className="text-lg">{startTime ? "Parar" : "Iniciar"}</span>
					</button>
					<span className="text-4xl text-neutral-700 font-extralight z-10">
						{timer}
					</span>
					<span className="text-7xl text-gray-100 font-light absolute -end-5 z-0">
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

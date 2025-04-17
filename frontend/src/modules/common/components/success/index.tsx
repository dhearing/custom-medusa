import { AiOutlineCheckCircle } from "react-icons/ai";

interface SuccessProps {
	title: string;
	details: string;
}

const Success = ({ title, details }: SuccessProps) => {
	return (
		<div className='flex flex-col justify-center items-center min-h-[50vh] px-3'>
			<AiOutlineCheckCircle size={200} color="#50e69d" className="mb-5" />
			<div className="text-center text-xl font-medium text-srp-mainBlue mb-5">
				{title}
			</div>
			<div className="w-75 text-center text-lg text-srp-mainBlue">
				{details}
			</div>
		</div>
	)
}

export default Success
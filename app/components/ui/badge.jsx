export default function Badge({text}) {
    return (
        <>
             <span className="cursor-pointer rounded-lg bg-[#FEF0C7] px-3 py-1 text-[#7A3314] border-[0.5px] border-[transparent] hover:border-[#7A3314]">
                {text}
            </span>
        </>
    );
} 

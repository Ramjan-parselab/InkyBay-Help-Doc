import { ArrowLeftRight } from "lucide-react";
import Card from "../ui/card";

export default function SingleSupport() {
    return (
        <>
            <Card 
                title="Getting Started" 
                text = "Set up JewelsLab with your Shopify store in just a few steps."
                icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                buttonText="Live Chat"
                url="/"
                variant="support"
            />
            <Card 
                title="Getting Started" 
                text = "Set up JewelsLab with your Shopify store in just a few steps."
                icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                buttonText="Live Chat"
                url="/"
                variant="support"
            />
            <Card 
                title="Getting Started" 
                text = "Set up JewelsLab with your Shopify store in just a few steps."
                icon={<ArrowLeftRight className="h-5 w-5 text-[#344054]" />}
                buttonText="Live Chat"
                url="/"
                variant="support"
            />
        </>
    );

}
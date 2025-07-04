import Collapsible from "../ui/collapsible";

const tabItems = [
  {
    id: 1,
    label: "General",
    count: 3,
    content: (
      <>

      <Collapsible index={1} title="What is JewelsLab?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
      <Collapsible index={2} title="Is JewelsLab compatible with all Shopify themes?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
      <Collapsible index={3} title="Do I need coding knowledge to use JewelsLab?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
      </>
    ),
  },
  {
    id: 2,
    label: "Product Customization",
    count: 1,
    content: (
      <Collapsible index={1} title="Is JewelsLab compatible with all Shopify themes?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
    ),
  },
  {
    id: 3,
    label: "Orders & Fulfillment",
    count: 1,
    content: (
      <Collapsible index={1} title="Do I need coding knowledge to use JewelsLab?" text="loJewelsLab is a Shopify app that helps merchants offer customizable jewelry to customers with a simple and intuitive interface"/>
    ),
  },
];

export default tabItems;
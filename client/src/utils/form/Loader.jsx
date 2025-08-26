import { Commet } from "react-loading-indicators";
import Layout from "../../components/common/Layout";

export const Loader = ()=>(
<Layout>
    <div className="grid min-h-screen place-content-center">
    <Commet color="blue" size="large" text="Loading" textColor="" />
    </div>
  </Layout>
)


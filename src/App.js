import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "styles/index.scss";

const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));

const App = () => {

  return (
    <Suspense>
      <Routes>
        <Route index path="dashboard" element={<Dashboard />}/>        
      </Routes>
    </Suspense>
  );
};

export default App;

import RealtimeCount from "./RealtimeCount";
import RealtimeGraph from "./RealtimeGraph";
import RealtimeMap from "./RealtimeMap";

const RealtimeDashboard = () => {
  return (
    <>
      <RealtimeMap />
      <RealtimeCount />
      <RealtimeGraph />
    </>
  );
};

export default RealtimeDashboard;

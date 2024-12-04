import { Link } from "react-router-dom";

const Own = () => {
  return (
    <>
      <h2 style={{
        color: "green",
        textAlign: "center",
        fontSize: "20px",
        margin: "20px 0",
        fontFamily: "Arial, sans-serif"
      }}>
        Want to create your own product or post? <Link to="/create-post" style={{ color: "blue", textDecoration: "underline" }}>Click here</Link>
      </h2>
    </>
  );
};

export default Own;
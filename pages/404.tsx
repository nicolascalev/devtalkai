import React from "react";
import AppError from "../components/ui/AppError";

function NotFoundPage() {
  return (
    <AppError
      status={404}
      label="Not Found"
      message="The resource you are looking for was not found"
      redirectUrl="/"
      redirectButtonLabel="Home"
    />
  );
}

export default NotFoundPage;

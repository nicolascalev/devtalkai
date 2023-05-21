import React from "react";
import AppError from "../components/ui/AppError";

function ForbiddenPage() {
  return (
    <AppError
      status={403}
      label="Forbidden"
      message="You are not allowed to see this resource"
      redirectUrl="/"
      redirectButtonLabel="Home"
    />
  );
}

export default ForbiddenPage;

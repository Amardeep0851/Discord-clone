import React from 'react'

function page() {
  const fileUrl = "hereisthefile.jsp.sjk.ksk";
  const type = fileUrl.split(".").pop();
  console.log("THis is the type", type);
  return (
    <div>page</div>
  )
}

export default page
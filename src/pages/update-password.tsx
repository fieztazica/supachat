import { useSupabase } from "@/lib/supabaseClient";
import { Box } from "@chakra-ui/react";
import React from "react";

function UpdatePassword() {
  const { user, session, supabase } = useSupabase();

//   React.useEffect(() => {
//     supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log(event, session);
//       if (event == "PASSWORD_RECOVERY") {
//         const newPassword =
//           prompt("What would you like your new password to be?") || undefined;
//         const { data, error } = await supabase.auth.updateUser({
//           password: newPassword,
//         });

//         if (data) alert("Password updated successfully!");
//         if (error) alert("There was an error updating your password.");
//       }
//     });
//   }, []);
  return <Box>Update password</Box>;
}

export default UpdatePassword;

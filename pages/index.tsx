import { Button, Stack } from "@mui/material";

export default function Home(): JSX.Element {
  return (
    <Stack sx={{ mx: "7%" }} alignItems="center" spacing={2}>
      <h1>Welcome to the Scheduler Builder</h1>
      <Button
        variant="contained"
        color="secondary"
        sx={{ typography: "h5", padding: 2, width: 300 }}
        href="/edit-schedule"
      >
        Create Schedule
      </Button>
      <Button variant="contained" color="primary">
        Advanced Options
      </Button>
    </Stack>
  );
}

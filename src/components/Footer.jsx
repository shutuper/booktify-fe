import { Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <Container
      className="rounded-t-lg shadow-xl"
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.main",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginTop: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} alignItems="center">
            <Typography color="primary.contrastText" variant="subtitle1">
              <Stack
                direction="row"
                divider={
                  <Divider orientation="vertical" flexItem color="white" />
                }
                spacing={2}
              >
                <span>{new Date().getFullYear()}</span>
                <span>©Booktify</span>
                <Link
                  to={"/sign-up"}
                  className="cursor-pointer hover:text-pink-500"
                >
                  For business
                </Link>
              </Stack>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default Footer;

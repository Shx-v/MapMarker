import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "../../context/LocationContext";

const SideNav = () => {
  const { pins, setPins, setSelectedPin } = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const deletePin = (pinToDelete) => {
    setPins((prevPins) =>
      prevPins.filter(
        (pin) => pin.lat !== pinToDelete.lat || pin.lng !== pinToDelete.lng
      )
    );
  };

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" onClick={toggleDrawer(false)}>
      <Stack marginLeft={2}>
        <Typography fontSize={24} fontWeight={600} color="#444">
          Pins
        </Typography>
      </Stack>
      <Divider />
      <List>
        {pins.map((pin, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon
                onClick={() => {
                  setSelectedPin(pin);
                }}
              >
                <LocationOnIcon />
              </ListItemIcon>
              <Stack
                onClick={() => {
                  setSelectedPin(pin);
                }}
              >
                <Typography fontSize={16} fontWeight={500}>
                  {pin.remark}
                </Typography>
                <Typography fontSize={10} color="textPrimary">
                  {pin.address || "No address available"}
                </Typography>
              </Stack>
              <ListItemIcon
                sx={{ marginLeft: "auto" }}
                onClick={() => {
                  deletePin(pin);
                }}
              >
                <CloseIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
        {pins.length == 0 && (
          <Stack alignItems={"center"}>
            <Typography>No Pins</Typography>
          </Stack>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default SideNav;

import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import React, { CSSProperties } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import Link from "next/link";
import { useRouter } from "next/router";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

interface menuItem {
  text: string;
  path: string;
  icon: React.ElementType;
}

const SideBar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}: SidebarProps) => {
  const router = useRouter();
  const MenuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: EqualizerIcon },
  ];

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };
  const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.08)",
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {MenuItems.map((item, index) => (
          <Link key={item.text} href={item.path} style={baseLinkStyle}>
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{
                  ...(router.pathname === item.path ? activeLinkStyle : {}),
                }}
              >
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        // onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* pc用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideBar;

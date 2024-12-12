// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const SideNavBar = () => {
//   const { isAuthenticated } = useSelector((state) => state.user);
//   console.log("isAuthenticated", isAuthenticated);
//   return (
//     <>
//       {isAuthenticated ? (
//         <>
//           <div>SideNavBar</div>
//           <Outlet />
//         </>
//       ) : (
//         <Navigate to="/signin" />
//       )}
//     </>
//   );
// };

// export default SideNavBar;

import { useSelector } from "react-redux";
import { Navigate, Outlet, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Typography,
  ListItemButton,
  Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

const navigationItems = [
  { text: "Blogs", icon: <ArticleIcon />, path: "/blogs" },
  {
    text: "Notifications",
    icon: <NotificationsIcon />,
    path: "/notifications",
  },
  { text: "Write", icon: <EditNoteIcon />, path: "/editor" },
];

const settingsItems = [
  { text: "Edit Profile", icon: <PersonIcon />, path: "/setting/edit-profile" },
  {
    text: "Change Password",
    icon: <LockIcon />,
    path: "/setting/change-password",
  },
];

const SideNavBar = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const theme = useTheme();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <Box className="min-height" sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          variant: "permanent",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            marginTop: "64px",
            height: `calc(100% - 64px)`,
            zIndex: theme.zIndex.appBar - 1,
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          {" "}
          {/* Header height offset */}
          {/* Dashboard Section */}
          <Typography
            variant="subtitle2"
            sx={{
              px: 3,
              py: 2,
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Dashboard
          </Typography>
          {/* Navigation Items */}
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">{item.text}</Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {/* Settings Section */}
          <Typography
            variant="subtitle2"
            sx={{
              px: 3,
              py: 2,
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Settings
          </Typography>
          {/* Settings Items */}
          <List>
            {settingsItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.action.selected,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2">{item.text}</Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default SideNavBar;

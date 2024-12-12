import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import MoreIcon from "@mui/icons-material/MoreVert";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import Brightness2OutlinedIcon from "@mui/icons-material/Brightness2Outlined";
import { useTheme } from "@emotion/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { showNotification } from "../redux/slices/notificationSlice";
import { Button, Container } from "@mui/material";
import { useState } from "react";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SettingsIcon from "@mui/icons-material/Settings";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// eslint-disable-next-line react/prop-types
export default function PrimarySearchAppBar({ toggleTheme, isDarkMode }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [logoutApiCall] = useLogoutMutation();
  const isMenuOpen = Boolean(anchorEl);
  // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    try {
      const response = await logoutApiCall().unwrap();
      dispatch(
        showNotification({
          open: true,
          message: response.message,
          severity: response.status,
        })
      );

      dispatch(logout());
      handleMenuClose();
      navigate("/signin"); // Add this if you want to redirect to home page
    } catch ({ data }) {
      dispatch(
        showNotification({
          open: true,
          message: data.message,
          severity: data.status,
        })
      );
      console.log("Failed to logout:", data);
    }
  };

  const handleMobileSearchClick = () => {
    setShowMobileSearch((preValue) => !preValue);
  };

  // const handleMobileMenuClose = () => {
  //   setMobileMoreAnchorEl(null);
  // };

  const handleMenuClose = () => {
    setAnchorEl(null);
    navigate("/setting");
    // handleMobileMenuClose();
  };

  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        sx={{ display: { md: "none" } }}
        onClick={() => {
          handleMenuClose();
          navigate("/editor");
        }}
      >
        <CreateIcon
          sx={{
            marginRight: theme.spacing(5),
          }}
        />
        Write
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <PersonOutlineIcon sx={{ marginRight: theme.spacing(5) }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <SpaceDashboardIcon sx={{ marginRight: theme.spacing(5) }} />
        DashBoard
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <SettingsIcon sx={{ marginRight: theme.spacing(5) }} />
        Setting
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ marginRight: theme.spacing(5) }} />
        Logout
      </MenuItem>
    </Menu>
  );

  // const mobileMenuId = "primary-search-account-menu-mobile";
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem>
  //       <IconButton size="large" aria-label="show 4 new mails" color="inherit">
  //         <Badge badgeContent={4} color="error">
  //           <MailIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Messages</p>
  //     </MenuItem>
  //     <MenuItem>
  //       <IconButton
  //         size="large"
  //         aria-label="show 17 new notifications"
  //         color="inherit"
  //       >
  //         <Badge badgeContent={10} color="error">
  //           <NotificationsOutlinedIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Notifications</p>
  //     </MenuItem>
  //     <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         size="large"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="inherit" elevation={0}>
          <Container maxWidth="xl">
            <Toolbar
              sx={{
                gap: 4,
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  fontSize: {
                    xs: theme.typography.fontSizes.sm,
                    sm: theme.typography.fontSizes.xl,
                  },
                  display: {
                    xs: "block",
                    fontFamily: "'Pacifico', cursive",
                    textDecoration: "none", // This removes the underline from the link
                    color: "inherit", // This keeps the text color unchanged
                  },
                }}
              >
                Blogify
              </Typography>
              <Search
                sx={{
                  borderRadius: "30px",
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              >
                <SearchIconWrapper
                  onClick={handleSearch}
                  sx={{
                    color: "grey",
                    zIndex: 50,
                    cursor: "pointer",
                  }}
                >
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  value={searchQuery}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  sx={{
                    borderRadius: "30px",
                    paddingY: theme.spacing(1),
                  }}
                />
              </Search>

              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isAuthenticated && (
                  <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    onClick={() => navigate("/editor")}
                    sx={{
                      display: { md: "flex", xs: "none" },
                      "& .MuiSvgIcon-root": {
                        fontSize: {
                          xs: theme.typography.fontSizes.xl,
                          sm: theme.typography.fontSizes["2xl"],
                        },
                      },
                    }}
                  >
                    <EditNoteIcon />
                    <Typography>Write</Typography>
                  </IconButton>
                )}
                <IconButton
                  size="large"
                  aria-label="search"
                  color="inherit"
                  onClick={handleMobileSearchClick}
                  sx={{
                    display: { md: "none" },
                    "& .MuiSvgIcon-root": {
                      fontSize: {
                        xs: theme.typography.fontSizes.xl,
                        sm: theme.typography.fontSizes["2xl"],
                      },
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
                <IconButton
                  onClick={toggleTheme}
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: {
                        xs: theme.typography.fontSizes.xl,
                        sm: theme.typography.fontSizes["2xl"],
                      },
                    },
                  }}
                >
                  {isDarkMode ? (
                    <WbSunnyOutlinedIcon />
                  ) : (
                    <Brightness2OutlinedIcon />
                  )}
                </IconButton>

                {!isAuthenticated ? (
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Button
                      variant="containedPrimary"
                      onClick={() => navigate("/signin")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="containedSecondary"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                  </Box>
                ) : (
                  <>
                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: {
                            xs: theme.typography.fontSizes.xl,
                            sm: theme.typography.fontSizes["2xl"],
                          },
                        },
                      }}
                    >
                      <Badge badgeContent={17} color="error">
                        <NotificationsOutlinedIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: {
                            xs: theme.typography.fontSizes.xl,
                            sm: theme.typography.fontSizes["2xl"],
                          },
                        },
                      }}
                    >
                      {userInfo.profilePicture ? (
                        <img
                          src={userInfo.profilePicture}
                          alt="Profile"
                          style={{
                            width: "35px", // Adjust size as needed
                            height: "35px",
                            borderRadius: "50%", // Make it circular
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <AccountCircle />
                      )}
                    </IconButton>
                  </>
                )}
              </Box>
              {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              // aria-controls={mobileMenuId}
              aria-haspopup="true"
              // onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
            </Toolbar>
          </Container>
        </AppBar>
        {/* {renderMobileMenu} */}
        {renderMenu}
        {showMobileSearch && (
          <Box
            sx={{
              width: "100%",
              padding: 2,
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
              display: { md: "none" },
            }}
          >
            <Search
              sx={{
                borderRadius: theme.shape.borderRadius,
                width: "100%",
              }}
            >
              <SearchIconWrapper
                sx={{
                  color: theme.palette.text.secondary,
                  zIndex: 50,
                }}
              >
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  width: "100%",
                }}
              />
            </Search>
          </Box>
        )}
      </Box>
      <Outlet />
    </>
  );
}

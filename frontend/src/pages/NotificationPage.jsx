import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetNotificationQuery } from "../redux/api/notificationApiSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatDate } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { useMarkAsReadMutation } from "../redux/api/notificationApiSlice";

const NotificationPage = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const maxLimit = 10;

  const [markAsRead] = useMarkAsReadMutation();

  let filters = ["all", "like", "comment", "reply"];
  const { data, isLoading, refetch } = useGetNotificationQuery({
    page: page,
    maxLimit: maxLimit,
    filter: filter,
  });

  const handleFilterChange = (filterName) => {
    setNotifications([]);
    setFilter(filterName);
    setPage(1);
  };

  useEffect(() => {
    refetch();
  }, [page, filter, refetch]);

  useEffect(() => {
    if (data?.data?.notifications) {
      setNotifications((prev) => [...prev, ...data.data.notifications]);
    }
  }, [data]);

  const notificationData = data?.data?.notifications;

  console.log(notificationData);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <FavoriteIcon color="error" />;
      case "comment":
        return <CommentIcon color="primary" />;
      case "reply":
        return <ReplyIcon color="action" />;
      default:
        return <NotificationsIcon color="disabled" />;
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    console.log("notificationId_58", notificationId);
    try {
      const response = await markAsRead({ notificationId });
      console.log("response_60", response);
    } catch (error) {
      console.log("error_62", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
        Recent Notifications
      </Typography>
      <Box
        sx={{
          my: 4,
        }}
      >
        {filters.map((filterName, index) => (
          <Button
            key={index}
            variant={filterName !== filter ? "containedSecondary" : "contained"}
            sx={{ marginRight: 4, marginBottom: 4 }}
            onClick={() => handleFilterChange(filterName)}
          >
            {filterName}
          </Button>
        ))}
      </Box>
      {isLoading ? (
        [...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={100}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ))
      ) : notifications.length > 0 ? (
        <Box>
          {notifications.map((notification) => (
            <Card
              sx={{
                mb: 2,
                backgroundColor: notification.read
                  ? "transparent"
                  : "rgba(33, 150, 243, 0.08)",
                borderRadius: 1,
                cursor: "pointer",
                border: notification.read
                  ? "1px solid transparent"
                  : "1px solid #2196f3", // Add border for unread
              }}
              key={notification._id}
              elevation={2}
            >
              <CardContent onClick={() => handleMarkAsRead(notification._id)}>
                <Box
                  component={Link}
                  to={notification.link}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <IconButton sx={{ mr: 2 }} size="small">
                    {getIcon(notification.type)}
                  </IconButton>
                  <Box>
                    <Typography variant="subtitle1" component="div">
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(notification?.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography>No notifications found</Typography>
      )}

      {data?.data?.hasNextPage && (
        <Button variant="text" onClick={() => setPage(data?.data?.nextPage)}>
          Load More
        </Button>
      )}
    </Container>
  );
};

export default NotificationPage;

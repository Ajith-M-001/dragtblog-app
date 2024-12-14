import Notification from "../model/notificationSchema.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getNewNotification = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      read: false,
    });
    console.log(notifications);
    const unreadCount = notifications.length; // Count of unread notifications

    res
      .status(200)
      .json(ApiResponse.success(unreadCount, "New notification", 200));
  } catch (error) {
    next(error);
  }
};

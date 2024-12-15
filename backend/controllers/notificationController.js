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

export const getNotification = async (req, res, next) => {
  try {
    const { page = 1, filter = "all", maxLimit = 10, sort = -1 } = req.query;
    console.log(req.query);

    const pageNumber = Math.max(1, Number(page));
    const limit = Math.max(1, Math.min(Number(maxLimit), 50)); // Limit max to 50 notifications per page
    const skip = (pageNumber - 1) * limit;

    const filterOptions = {};
    if (filter !== "all") {
      filterOptions.type = filter;
    }

    const notifications = await Notification.find({
      recipient: req.user._id,
      ...filterOptions,
    })
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalNotifications = await Notification.countDocuments({
      recipient: req.user._id,
      ...filterOptions,
    });
    const totalPages = Math.ceil(totalNotifications / limit);
    const hasNextPage = pageNumber < totalPages;
    const nextPage = hasNextPage ? pageNumber + 1 : null;

    const responseObject = {
      notifications, // Array of notifications
      totalNotifications,
      totalPages, // Total number of pages
      currentPage: pageNumber, // Current page number
      nextPage, // The next page number if available, null otherwise
      hasNextPage, // Boolean indicating if there are more pages
    };
    res
      .status(200)
      .json(ApiResponse.success(responseObject, "Fetched notifications", 200));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    console.log("_notificationId", notificationId);
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res
      .status(200)
      .json(
        ApiResponse.success(notification, "Notification marked as read", 200)
      );
  } catch (error) {
    next(error);
  }
};

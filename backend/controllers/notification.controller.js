import Notification from '../models/notification.model.js';
export const getNotifications = async (req, res) => {
  try {
    const userId=req.user._id;
    const notifications = await Notification.find({ to:userId })
      .sort({ createdAt: -1 })
      .populate({
        "path": "from",
        "select": "username profileImg"
      })
await Notification.updateMany({to:userId}, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: 'Notifications deleted successfully' });    
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }}
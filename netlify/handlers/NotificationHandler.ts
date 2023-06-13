import { Offer } from '../database/models/Offer';
import UserNotificationModel, {
  Types,
  UserNotification,
} from '../database/models/UserNotification';
import { TimestampedEntity } from '../types';

class NotificationHandler {
  private async createNotification(params: Omit<UserNotification, keyof TimestampedEntity>) {
    return await UserNotificationModel.create(params);
  }

  public async createNewOfferReceivedNotification(offer: Offer) {
    await this.createNotification({
      text: 'You received a new contract offer',
      type: Types.NEW_OFFER_RECEIVED,
      user: offer.tutor.user,
      attributes: { offerId: offer._id },
    });
  }
}

export default NotificationHandler;

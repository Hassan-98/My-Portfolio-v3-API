//= Models
import BOOKS, { BooksModel } from './book.model';
import LogService from '../Logs/log.service';
//= Types
import { Book } from './book.types';
import { User } from '../User/user.types';

class BooksService {
  public MODEL: BooksModel = BOOKS;
  private Logger = new LogService();

  public async getAllBooks(currentUser: User): Promise<Book[]> {
    let books: Book[] = await this.MODEL.find({}).lean();

    await this.Logger.createLog({
      action: `Get all books`,
      details: `User (ID: ${currentUser._id}) fetched all books data`,
      user: currentUser._id
    })

    return books;
  }
}

export default BooksService;

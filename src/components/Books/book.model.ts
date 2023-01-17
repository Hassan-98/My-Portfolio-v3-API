import mongoose from 'mongoose';
import { Book } from './book.types';

const BookSchema = new mongoose.Schema({
  title: String,
  pages: Number
});


const Model = mongoose.model<Book>("Book", BookSchema);

export type BooksModel = typeof Model;

export default Model;

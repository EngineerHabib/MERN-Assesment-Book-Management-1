
import BookItem from './BookItem';

const BookList = ({ books, onDelete, onToggleRead }) => {
  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
        <div className="text-4xl">📚</div>

        <h3 className="mt-3 text-lg font-semibold text-slate-700">
          No Books Available
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Add your first book using the form.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Reading List Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            All Books
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your book collection.
          </p>
        </div>

        <span className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
          {books.length} {books.length === 1 ? 'Book' : 'Books'}
        </span>
      </div>

      {/* Book Items */}
      <div className="space-y-3">
        {books.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onDelete={onDelete}
            onToggleRead={onToggleRead}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;

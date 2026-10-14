
import {
  FaCheckCircle,
  FaUndo,
  FaTrash,
  FaBookOpen,
} from 'react-icons/fa';

const BookItem = ({ book, onDelete, onToggleRead }) => {
  const isRead = book.status === 'read';

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:justify-between ${
        isRead
          ? 'border-l-4 border-l-emerald-500'
          : 'border-l-4 border-l-blue-500'
      }`}
    >
      {/* Book Information */}
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
            isRead
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-blue-50 text-blue-600'
          }`}
        >
          {isRead ? (
            <FaCheckCircle className="text-lg" />
          ) : (
            <FaBookOpen className="text-lg" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-base font-semibold ${
              isRead
                ? 'text-slate-500 line-through'
                : 'text-slate-800'
            }`}
          >
            {book.title}
          </h3>

          <p className="mt-1 break-words text-sm text-slate-500">
            Author: {book.author}
          </p>

          <span
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-medium ${
              isRead
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {isRead ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggleRead(book.id)}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition sm:flex-none ${
            isRead
              ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title={isRead ? 'Mark as Unread' : 'Mark as Read'}
        >
          {isRead ? <FaUndo /> : <FaCheckCircle />}
          {isRead ? 'Mark Unread' : 'Mark Read'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(book.id)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 sm:flex-none"
          title="Delete Book"
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookItem;

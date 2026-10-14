import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

const API_URL = 'http://localhost:5000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to load books');
        }

        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Add a new book
  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to add book');
        return;
      }

      setBooks((prevBooks) => [data, ...prevBooks]);
      toast.success('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    }
  };

  // Delete a book
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to delete book');
        return;
      }

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );

      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  // Toggle read/unread status
  const handleToggleRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
      });

      const updatedBook = await response.json();

      if (!response.ok) {
        toast.error('Failed to update status');
        return;
      }

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? updatedBook : book
        )
      );

      toast.success('Book status updated!');
    } catch (error) {
      console.error('Error updating book status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl text-white">
              📚
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Book Management
              </h1>
              <p className="text-xs text-slate-500">
                Manage your personal library
              </p>
            </div>
          </div>

          <span className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            {books.length} {books.length === 1 ? 'Book' : 'Books'}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Add Book Form */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                Add a New Book
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the book details below.
              </p>
            </div>

            <div className="p-5">
              <BookForm onAddBook={handleAddBook} />
            </div>
          </section>

          {/* Book List */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Book List
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View and manage your books.
                </p>
              </div>

              <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                Total: {books.length}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                  <p className="mt-3 text-sm text-slate-500">
                    Loading books...
                  </p>
                </div>
              ) : books.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 px-4 py-12 text-center">
                  <div className="text-4xl">📚</div>
                  <h3 className="mt-3 font-semibold text-slate-700">
                    No books found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add a new book using the form.
                  </p>
                </div>
              ) : (
                <BookList
                  books={books}
                  onDelete={handleDeleteBook}
                  onToggleRead={handleToggleRead}
                />
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-200 py-5 text-center">
          <p className="text-sm text-slate-500">
            Book Management System
          </p>
        </footer>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
          },
        }}
      />
    </div>
  );
}

export default App;
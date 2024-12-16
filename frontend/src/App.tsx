import { useEffect, useState } from "react";

// Definisikan tipe data mahasiswa
interface Mahasiswa {
  id: number;
  nim: number;
  nama_lengkap: string;
  kelas: string;
  alamat: string;
}

function App() {
  const [mahasiswaData, setMahasiswaData] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [formData, setFormData] = useState<Mahasiswa>({
    id: 0,
    nim: 0,
    nama_lengkap: "",
    kelas: "",
    alamat: "",
  });

  const addMahasiswa = async (newMahasiswa: Mahasiswa) => {
    try {
      const response = await fetch("http://localhost:3000/mahasiswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMahasiswa),
      });
      const data = await response.json();
      if (response.ok) {
        setMahasiswaData([...mahasiswaData, data.payload.datas]);
      } else {
        console.error("Failed to add mahasiswa:", data.message);
      }
    } catch (error) {
      console.error("Error adding mahasiswa:", error);
    }
  };

  // Fungsi untuk mengedit mahasiswa
  const editMahasiswa = async (id: number, updatedMahasiswa: Mahasiswa) => {
    try {
      const response = await fetch(`http://localhost:3000/mahasiswa/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMahasiswa),
      });
      const data = await response.json();
      if (response.ok) {
        setMahasiswaData(
          mahasiswaData.map((mahasiswa) =>
            mahasiswa.id === id ? { ...mahasiswa, ...updatedMahasiswa } : mahasiswa
          )
        );
      } else {
        console.error("Failed to update mahasiswa:", data.message);
      }
    } catch (error) {
      console.error("Error updating mahasiswa:", error);
    }
  };

  // Fungsi untuk menghapus mahasiswa
  const deleteMahasiswa = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/mahasiswa/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMahasiswaData(mahasiswaData.filter((mahasiswa) => mahasiswa.id !== id));
      } else {
        console.error("Failed to delete mahasiswa:", data.message);
      }
    } catch (error) {
      console.error("Error deleting mahasiswa:", error);
    }
  };

  // Ambil data mahasiswa dari backend
  useEffect(() => {
    const fetchMahasiswaData = async () => {
      try {
        const response = await fetch("http://localhost:3000");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMahasiswaData(data.payload.datas);
        setLoading(false);
      } catch (error) {
        setError("Gagal mengambil data");
        setLoading(false);
      }
    };

    fetchMahasiswaData();
  }, [mahasiswaData]);

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      id: 0,
      nim: 0,
      nama_lengkap: "",
      kelas: "",
      alamat: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (mahasiswa: Mahasiswa) => {
    setModalMode("edit");
    setSelectedMahasiswa(mahasiswa);
    setFormData(mahasiswa);
    setIsModalOpen(true);
  };

  // Open modal for delete
  const openDeleteModal = (mahasiswa: Mahasiswa) => {
    setModalMode("delete");
    setSelectedMahasiswa(mahasiswa);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMahasiswa(null);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      await addMahasiswa(formData);
    } else if (modalMode === "edit" && selectedMahasiswa) {
      await editMahasiswa(selectedMahasiswa.id, formData);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-700 mb-6">Data Mahasiswa</h1>
      {loading && <p className="text-lg text-blue-500">Loading...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}

      <button
        onClick={openCreateModal}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        Tambah Mahasiswa
      </button>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">NIM</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Nama Lengkap</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Kelas</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Alamat</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mahasiswaData.length > 0 ? (
                mahasiswaData.map((mahasiswa) => (
                  <tr key={mahasiswa.id}>
                    <td className="py-3 px-4 text-sm text-gray-600">{mahasiswa.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{mahasiswa.nim}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{mahasiswa.nama_lengkap}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{mahasiswa.kelas}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{mahasiswa.alamat}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <button
                        onClick={() => openEditModal(mahasiswa)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(mahasiswa)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-sm text-center text-gray-600">Data tidak tersedia</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {modalMode === "create" ? "Tambah Mahasiswa" : modalMode === "edit" ? "Edit Mahasiswa" : "Hapus Mahasiswa"}
            </h2>
            {modalMode !== "delete" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nim" className="block text-sm font-medium text-gray-700">NIM</label>
                  <input
                    type="number"
                    id="nim"
                    name="nim"
                    value={formData.nim}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">Kelas</label>
                  <input
                    type="text"
                    id="kelas"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                  <input
                    type="text"
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {modalMode === "create" ? "Tambah" : modalMode === "edit" ? "Simpan" : "Hapus"}
                  </button>
                </div>
              </form>
            )}
            {modalMode === "delete" && (
              <div className="flex justify-between">
                <p>Apakah Anda yakin ingin menghapus mahasiswa ini?</p>
                <div className="flex space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedMahasiswa) {
                        deleteMahasiswa(selectedMahasiswa.id);
                      }
                      closeModal();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

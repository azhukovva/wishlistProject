import CreateUserForm from "../components/CreateUserForm";

export default function CreateUserPage() {
  return (
    <main className="flex h-screen">
      {/* right part */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
        Create User
      </div>
      {/* left part */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <CreateUserForm />
        </div>
      </div>
    </main>
  );
}

import CreateQrForm from './create-form';

export default function CreateQrPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F0F0F]">Create QR Code</h1>
        <p className="mt-1 text-sm text-gray-500">Generate a tracked redirect QR code</p>
      </div>
      <CreateQrForm />
    </div>
  );
}

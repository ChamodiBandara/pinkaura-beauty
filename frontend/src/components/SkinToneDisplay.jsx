function SkinToneDisplay({ results, onReset }) {
  const { user_name, category, exact_skin_color, undertone_info, ai_validation } = results

  return (
    <div className="space-y-6">
      {/* User Name */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-pink-600">
          {user_name}'s Results
        </h3>
      </div>

      {/* Color Swatch */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Skin Color</p>
        <div
          className="w-full h-32 rounded-lg border-4 border-gray-300 shadow-lg"
          style={{ backgroundColor: exact_skin_color.hex }}
        />
        <p className="mt-2 text-lg font-mono font-bold">
          {exact_skin_color.hex}
        </p>
      </div>

      {/* Category */}
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <p className="text-sm font-medium text-gray-600">Category</p>
        <p className="text-xl font-bold text-pink-700 mt-1">
          #{category.number} - {category.name}
        </p>
        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
      </div>

      {/* Undertone */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-sm font-medium text-gray-600">Undertone</p>
        <p className="text-xl font-bold text-purple-700 mt-1">
          {undertone_info.undertone}
        </p>
        <p className="text-sm text-gray-600 mt-1">{undertone_info.description}</p>
      </div>

      {/* Fitzpatrick Type */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-gray-600">Fitzpatrick Type</p>
        <p className="text-xl font-bold text-blue-700 mt-1">
          Type {category.fitzpatrick}
        </p>
      </div>

      {/* AI Validation */}
      {ai_validation.validated && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm font-bold text-green-700">
            ✓ AI Validated ({Math.round(ai_validation.confidence * 100)}% confidence)
          </p>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-bold"
      >
        🔄 Analyze Another Person
      </button>
    </div>
  )
}

export default SkinToneDisplay
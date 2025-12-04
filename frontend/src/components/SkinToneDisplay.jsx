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

      {/* Lipstick Recommendations */}
      {results.lipstick_recommendation && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-gray-600">Lipstick Recommendations</p>

          <p className="text-xs text-gray-500 mt-2">{results.lipstick_recommendation.explanation}</p>

          {results.lipstick_recommendation.recommendations?.nude && (
            <>
              <p className="mt-3 font-semibold">Nude Shades</p>
              <ul className="list-disc ml-5">
                {results.lipstick_recommendation.recommendations.nude.map((l) => (
                  <li key={l.name} className="text-sm">
                    <span
                      style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
                    />
                    {l.name} — <span className="text-gray-600">{l.description}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* everyday */}
          {results.lipstick_recommendation.recommendations?.everyday && (
            <>
              <p className="mt-3 font-semibold">Everyday Shades</p>
              <ul className="list-disc ml-5">
                {results.lipstick_recommendation.recommendations.everyday.map((l) => (
                  <li key={l.name} className="text-sm">
                    <span
                      style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
                    />
                    {l.name} — <span className="text-gray-600">{l.description}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* bold */}
          {results.lipstick_recommendation.recommendations?.bold && (
            <>
              <p className="mt-3 font-semibold">Bold Shades</p>
              <ul className="list-disc ml-5">
                {results.lipstick_recommendation.recommendations.bold.map((l) => (
                  <li key={l.name} className="text-sm">
                    <span
                      style={{ display: 'inline-block', width: 14, height: 14, background: l.hex, marginRight: 8, verticalAlign: 'middle', borderRadius: 2 }}
                    />
                    {l.name} — <span className="text-gray-600">{l.description}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Tips & Avoid */}
          {results.lipstick_recommendation.tips && (
            <div className="mt-3">
              <p className="font-semibold">Application Tips</p>
              <ul className="list-disc ml-5 text-sm">
                {results.lipstick_recommendation.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
          {results.lipstick_recommendation.avoid && (
            <div className="mt-3">
              <p className="font-semibold">Colors to Avoid</p>
              <ul className="list-disc ml-5 text-sm">
                {results.lipstick_recommendation.avoid.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SkinToneDisplay
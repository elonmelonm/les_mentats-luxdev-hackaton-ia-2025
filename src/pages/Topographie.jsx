import React, { useState } from 'react';

function toNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Topographie = () => {
  const [form, setForm] = useState({
    lat1: '', lon1: '', alt1: '',
    lat2: '', lon2: '', alt2: ''
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    const lat1 = toNumber(form.lat1);
    const lon1 = toNumber(form.lon1);
    const lat2 = toNumber(form.lat2);
    const lon2 = toNumber(form.lon2);
    const alt1 = toNumber(form.alt1);
    const alt2 = toNumber(form.alt2);

    if (!Number.isFinite(lat1) || lat1 < -90 || lat1 > 90) e.lat1 = 'Latitude invalide (-90 à 90)';
    if (!Number.isFinite(lon1) || lon1 < -180 || lon1 > 180) e.lon1 = 'Longitude invalide (-180 à 180)';
    if (!Number.isFinite(lat2) || lat2 < -90 || lat2 > 90) e.lat2 = 'Latitude invalide (-90 à 90)';
    if (!Number.isFinite(lon2) || lon2 < -180 || lon2 > 180) e.lon2 = 'Longitude invalide (-180 à 180)';
    if (!Number.isFinite(alt1)) e.alt1 = 'Altitude départ invalide';
    if (!Number.isFinite(alt2)) e.alt2 = 'Altitude arrivée invalide';

    return { valid: Object.keys(e).length === 0, e, lat1, lon1, lat2, lon2, alt1, alt2 };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v.e);
    if (!v.valid) return;

    const distance = haversineDistanceMeters(v.lat1, v.lon1, v.lat2, v.lon2);
    const deltaAlt = v.alt2 - v.alt1;
    const slopePct = distance > 0 ? (deltaAlt / distance) * 100 : 0;

    setResult({ distance, deltaAlt, slopePct });
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Vérification de la topographie</h2>
            <p className="text-xl text-gray-600">Calculez la pente entre deux points à partir de leurs coordonnées et altitudes.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Point de départ</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitude</label>
                    <input name="lat1" value={form.lat1} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.lat1 && <p className="text-sm text-red-600 mt-1">{errors.lat1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitude</label>
                    <input name="lon1" value={form.lon1} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.lon1 && <p className="text-sm text-red-600 mt-1">{errors.lon1}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Altitude (m)</label>
                    <input name="alt1" value={form.alt1} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.alt1 && <p className="text-sm text-red-600 mt-1">{errors.alt1}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Point d'arrivée</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Latitude</label>
                    <input name="lat2" value={form.lat2} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.lat2 && <p className="text-sm text-red-600 mt-1">{errors.lat2}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Longitude</label>
                    <input name="lon2" value={form.lon2} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.lon2 && <p className="text-sm text-red-600 mt-1">{errors.lon2}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Altitude (m)</label>
                    <input name="alt2" value={form.alt2} onChange={onChange} type="number" step="any" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    {errors.alt2 && <p className="text-sm text-red-600 mt-1">{errors.alt2}</p>}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-center pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Vérifier</button>
              </div>
            </form>

            {result && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700">Distance</p>
                  <p className="text-2xl font-bold text-blue-900">{result.distance.toFixed(1)} m</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700">Différence d'altitude</p>
                  <p className="text-2xl font-bold text-green-900">{result.deltaAlt.toFixed(1)} m</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-700">Pente</p>
                  <p className="text-2xl font-bold text-yellow-900">{result.slopePct.toFixed(2)} %</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topographie;

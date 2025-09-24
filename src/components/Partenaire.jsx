import React, { useState } from 'react';

const Partenaire = () => {
  const [formData, setFormData] = useState({
    typePartenaire: '',
    nomOrganisation: '',
    secteur: '',
    nom: '',
    poste: '',
    email: '',
    telephone: '',
    description: '',
    proposition: '',
    budget: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique de soumission
    console.log('Données du formulaire:', formData);
    alert('Votre candidature de partenariat a été soumise avec succès !');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Devenir Partenaire
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rejoignez notre réseau de partenaires et contribuez au développement 
              de l'entrepreneuriat sénégalais. Ensemble, nous pouvons faire plus.
            </p>
          </div>

          {/* Types de partenariat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Partenaire Financier</h3>
              <p className="text-gray-600">
                Contribuez au financement des projets et bénéficiez de retours sur investissement attractifs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Partenaire Formation</h3>
              <p className="text-gray-600">
                Partagez votre expertise en proposant des formations et accompagnement aux entrepreneurs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Partenaire Réseau</h3>
              <p className="text-gray-600">
                Mettez à disposition votre réseau pour faciliter les connexions et opportunités.
              </p>
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Candidature de Partenariat
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de l'organisation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Informations de l'organisation
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de partenaire *
                    </label>
                    <select
                      name="typePartenaire"
                      value={formData.typePartenaire}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez le type</option>
                      <option value="financier">Partenaire Financier</option>
                      <option value="formation">Partenaire Formation</option>
                      <option value="reseau">Partenaire Réseau</option>
                      <option value="technologique">Partenaire Technologique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'organisation *
                    </label>
                    <input
                      type="text"
                      name="nomOrganisation"
                      value={formData.nomOrganisation}
                      onChange={handleChange}
                      required
                      placeholder="Nom de votre organisation"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur d'activité *
                    </label>
                    <select
                      name="secteur"
                      value={formData.secteur}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez le secteur</option>
                      <option value="banque">Banque</option>
                      <option value="assurance">Assurance</option>
                      <option value="formation">Formation</option>
                      <option value="conseil">Conseil</option>
                      <option value="technologie">Technologie</option>
                      <option value="industrie">Industrie</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget annuel disponible (FCFA)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Ex: 10000000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Informations du contact */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Informations du contact
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poste occupé *
                    </label>
                    <input
                      type="text"
                      name="poste"
                      value={formData.poste}
                      onChange={handleChange}
                      required
                      placeholder="Votre poste"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre.email@organisation.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      placeholder="+221 XX XXX XX XX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Description du partenariat */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Description du partenariat proposé
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description de votre organisation *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Décrivez votre organisation, ses activités, sa mission..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposition de partenariat *
                    </label>
                    <textarea
                      name="proposition"
                      value={formData.proposition}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Décrivez votre proposition de partenariat, les services que vous pouvez apporter..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Soumettre la candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partenaire;

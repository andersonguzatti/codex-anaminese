import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Basic in-app resources. You can later load from backend or files.
const resources = {
  'pt-BR': {
    translation: {
      'app.title': 'Anamnese Digital',
      'nav.home': 'Início',
      'nav.anamnesis': 'Anamnese',
      'sidebar.contexts': 'Contextos',
      'lang.pt': 'Português',
      'lang.en': 'Inglês',
      // Common
      'common.loading': 'Carregando...',
      // List
      'list.title': 'Anamneses',
      'list.new': 'Nova Anamnese',
      'list.filterByName': 'Filtrar por nome do cliente',
      'list.client': 'Cliente',
      'list.formDate': 'Data da Ficha',
      'list.createdAt': 'Criada em',
      'list.actions': 'Ações',
      'list.details': 'Detalhes',
      'list.empty': 'Nenhuma anamnese encontrada.',
      // Details
      'details.title': 'Detalhes da Anamnese',
      'details.print': 'Imprimir',
      'details.client': 'Cliente',
      'details.name': 'Nome',
      'details.birthDate': 'Nascimento',
      'details.city': 'Cidade',
      'details.form': 'Ficha',
      'details.formDate': 'Data da Ficha',
      'details.area': 'Área a ser removida',
      'details.createdAt': 'Criada em',
      'details.signedAt': 'Assinada em',
      'details.signatureCity': 'Cidade da assinatura',
      'details.signature': 'Assinatura',
      // Form
      'form.title': 'Ficha de Anamnese',
      // Success and errors
      'success.created': 'Ficha criada com sucesso! ID: {{id}}',
      'success.redirect': 'Redirecionando em {{count}}s…',
      'success.viewNow': 'Ver detalhes agora',
      'errors.loadList': 'Falha ao carregar a lista',
      'errors.loadDetails': 'Falha ao carregar os detalhes',
      'errors.requiredName': 'Nome é obrigatório',
      'errors.requiredSignature': 'Assinatura é obrigatória',
      'errors.submit': 'Falha ao enviar os dados',
    },
  },
  'en-US': {
    translation: {
      'app.title': 'Digital Anamnesis',
      'nav.home': 'Home',
      'nav.anamnesis': 'Anamnesis',
      'sidebar.contexts': 'Contexts',
      'lang.pt': 'Portuguese',
      'lang.en': 'English',
      // Common
      'common.loading': 'Loading...',
      // List
      'list.title': 'Anamneses',
      'list.new': 'New Anamnesis',
      'list.filterByName': 'Filter by client name',
      'list.client': 'Client',
      'list.formDate': 'Form Date',
      'list.createdAt': 'Created At',
      'list.actions': 'Actions',
      'list.details': 'Details',
      'list.empty': 'No anamneses found.',
      // Details
      'details.title': 'Anamnesis Details',
      'details.print': 'Print',
      'details.client': 'Client',
      'details.name': 'Name',
      'details.birthDate': 'Birth Date',
      'details.city': 'City',
      'details.form': 'Form',
      'details.formDate': 'Form Date',
      'details.area': 'Area to be removed',
      'details.createdAt': 'Created At',
      'details.signedAt': 'Signed At',
      'details.signatureCity': 'Signature City',
      'details.signature': 'Signature',
      // Form
      'form.title': 'Anamnesis Form',
      // Success and errors
      'success.created': 'Form created successfully! ID: {{id}}',
      'success.redirect': 'Redirecting in {{count}}s…',
      'success.viewNow': 'View details now',
      'errors.loadList': 'Failed to load the list',
      'errors.loadDetails': 'Failed to load details',
      'errors.requiredName': 'Full name is required',
      'errors.requiredSignature': 'Signature is required',
      'errors.submit': 'Failed to submit data',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
  })

export default i18n

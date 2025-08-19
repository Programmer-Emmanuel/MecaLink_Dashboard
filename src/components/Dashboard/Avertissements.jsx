import { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag, message, Image, Form, Input, Switch, Spin, Popconfirm, ConfigProvider } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from "../../constants/api/api";
import secureStorage from 'react-secure-storage';

const darkTheme = {
  token: {
    colorBgContainer: '#1e293b',
    colorBgElevated: '#1e293b',
    colorBorder: '#334155',
    colorText: '#f8fafc',
    colorTextHeading: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorPrimary: '#64748b',
    colorError: '#f87171',
    colorWarning: '#fbbf24',
    colorSuccess: '#4ade80',
    colorInfo: '#60a5fa',
  },
  components: {
    Table: {
      headerBg: '#1e293b',
      headerColor: '#f8fafc',
      headerSplitColor: '#334155',
      rowHoverBg: '#334155',
      borderColor: '#334155',
    },
    Modal: {
      contentBg: '#1e293b',
      headerBg: '#1e293b',
      footerBg: '#1e293b',
      titleColor: '#f8fafc',
    },
    Button: {
      defaultBg: '#1e293b',
      defaultBorderColor: '#334155',
      defaultColor: '#f8fafc',
    },
    Input: {
      colorBgContainer: '#1e293b',
      colorBorder: '#334155',
      colorText: '#f8fafc',
      colorTextPlaceholder: '#94a3b8',
    },
    Switch: {
      handleBg: '#f8fafc',
    },
    Pagination: {
      colorPrimary: '#f8fafc',
      colorPrimaryBorder: '#334155',
      colorBgContainer: '#1e293b',
      colorText: '#f8fafc',
    },
  },
};

export function Avertissements() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [form] = Form.useForm();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const token = secureStorage.getItem('token');
      const response = await api.get('/advertisements', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisements(response.data);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des publicités");
      message.error("Erreur lors du chargement des publicités");
    } finally {
      setLoading(false);
    }
  };

  const showAdDetails = (ad) => {
    setCurrentAd(ad);
    setModalVisible(true);
  };

  const showEditModal = (ad) => {
    setCurrentAd(ad);
    form.setFieldsValue({
      title: ad.title,
      description: ad.description,
      link: ad.link,
      isActive: ad.isActive
    });
    setEditModalVisible(true);
  };

  // Fonction de suppression corrigée
  const handleDelete = async (adId) => {
    try {
      const token = secureStorage.getItem('token');
      await api.delete(`/advertisements/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAdvertisements(advertisements.filter(ad => ad._id !== adId));
      message.success("Publicité supprimée avec succès");
    } catch (err) {
      console.error("Erreur:", err);
      message.error("Erreur lors de la suppression de la publicité");
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const token = secureStorage.getItem('token');
      
      const response = await api.put(`/advertisements/${currentAd._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAdvertisements(advertisements.map(ad => 
        ad._id === currentAd._id ? response.data : ad
      ));
      
      message.success("Publicité mise à jour avec succès");
      setEditModalVisible(false);
    } catch (err) {
      console.error("Erreur:", err);
      message.error("Erreur lors de la mise à jour de la publicité");
    }
  };

  const handleCreate = async () => {
    try {
      setCreateLoading(true);
      const token = secureStorage.getItem('token');
      
      const values = await form.validateFields();
      const adData = new FormData();
      
      adData.append('title', values.title);
      adData.append('description', values.description);
      adData.append('isActive', values.isActive);
      
      if (file) {
        adData.append('image', file);
      }

      const response = await api.post('/advertisements', adData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setAdvertisements([...advertisements, response.data.data]);
      message.success("Publicité créée avec succès");
      setCreateModalVisible(false);
      form.resetFields();
      setFile(null);
    } catch (err) {
      console.error("Erreur:", err);
      message.error("Erreur lors de la création de la publicité");
    } finally {
      setCreateLoading(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'image',
      render: (imageUrl) => (
        <Image 
          src={imageUrl} 
          alt="Publicité" 
          width={80}
          height={50}
          style={{ objectFit: 'cover' }}
          preview={false}
        />
      ),
    },
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Statut',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showAdDetails(record)}
            className="text-blue-400 hover:text-blue-300 border-blue-400 hover:border-blue-300"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
            className="text-yellow-400 hover:text-yellow-300 border-yellow-400 hover:border-yellow-300"
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette publicité ?"
            onConfirm={() => handleDelete(record._id)} // Passage direct de l'ID
            okText="Oui"
            cancelText="Non"
            overlayClassName="dark-popconfirm"
            okButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
            cancelButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
          >
            <Button 
              icon={<DeleteOutlined />} 
              className="text-red-400 hover:text-red-300 border-red-400 hover:border-red-300"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider theme={darkTheme}>
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Gestion des Publicités</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100"
          >
            Ajouter une publicité
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={advertisements}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 4,
            showSizeChanger: false,
            className: 'dark-pagination'
          }}
          className="bg-slate-800 rounded-lg overflow-hidden"
          bordered
        />

        {/* Modal de détails */}
        <Modal
          title="Détails de la publicité"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setModalVisible(false)} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100">
              Fermer
            </Button>,
          ]}
        >
          {currentAd && (
            <div className="space-y-4 text-slate-200">
              <div className="flex justify-center">
                <Image 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  width={300}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Titre:</h3>
                <p>{currentAd.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Description:</h3>
                <p>{currentAd.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Lien:</h3>
                <p>{currentAd.link || 'Aucun lien'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Statut:</h3>
                <Tag color={currentAd.isActive ? 'green' : 'red'}>
                  {currentAd.isActive ? 'Actif' : 'Inactif'}
                </Tag>
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Date de création:</h3>
                <p>{new Date(currentAd.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Dernière mise à jour:</h3>
                <p>{new Date(currentAd.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal d'édition */}
        <Modal
          title="Modifier la publicité"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={handleEdit}
          confirmLoading={loading}
          okButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
          cancelButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label={<span className="text-slate-300">Titre</span>}
              rules={[{ required: true, message: 'Veuillez entrer un titre' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={<span className="text-slate-300">Description</span>}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="isActive"
              label={<span className="text-slate-300">Statut</span>}
              valuePropName="checked"
            >
              <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal de création */}
        <Modal
          title="Créer une nouvelle publicité"
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onOk={handleCreate}
          confirmLoading={createLoading}
          okButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
          cancelButtonProps={{ className: 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-100' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label={<span className="text-slate-300">Titre</span>}
              rules={[{ required: true, message: 'Veuillez entrer un titre' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={<span className="text-slate-300">Description</span>}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label={<span className="text-slate-300">Image</span>}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
              />
            </Form.Item>
            <Form.Item
              name="isActive"
              label={<span className="text-slate-300">Statut</span>}
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { X } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  IconSizes,
  BrandColors,
  NeutralColors,
} from "@/constants/theme";

// Tipos de items que se pueden crear
export type ItemType = "vision" | "meta" | "objetivo" | "mision" | "tarea";

interface CreateItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { titulo: string; descripcion: string }) => void;
  itemType: ItemType;
  initialData?: { titulo: string; descripcion: string };
}

// Configuración para cada tipo de item
const ITEM_CONFIG: Record<
  ItemType,
  {
    createTitle: string;
    editTitle: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
  }
> = {
  vision: {
    createTitle: "Crear nueva Visión",
    editTitle: "Editar Visión",
    titlePlaceholder: "Ej: Convertirme en desarrollador senior",
    descriptionPlaceholder: "Describe tu visión a largo plazo...",
  },
  meta: {
    createTitle: "Crear nueva Meta",
    editTitle: "Editar Meta",
    titlePlaceholder: "Ej: Dominar React Native",
    descriptionPlaceholder: "Describe qué quieres lograr con esta meta...",
  },
  objetivo: {
    createTitle: "Crear nuevo Objetivo",
    editTitle: "Editar Objetivo",
    titlePlaceholder: "Ej: Completar 3 proyectos en React Native",
    descriptionPlaceholder:
      "Describe qué pasos necesitas para alcanzar este objetivo...",
  },
  mision: {
    createTitle: "Crear nueva Misión",
    editTitle: "Editar Misión",
    titlePlaceholder: "Ej: Estudiar hooks avanzados",
    descriptionPlaceholder:
      "Describe las actividades específicas de esta misión...",
  },
  tarea: {
    createTitle: "Crear nueva Tarea",
    editTitle: "Editar Tarea",
    titlePlaceholder: "Ej: Leer documentación de useEffect",
    descriptionPlaceholder: "Describe lo que necesitas hacer...",
  },
};

function CreateItemModal({
  visible,
  onClose,
  onSubmit,
  itemType,
  initialData,
}: CreateItemModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const config = ITEM_CONFIG[itemType];

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref para trackear si ya inicializamos y los valores iniciales
  const initializedRef = useRef(false);
  const lastInitialDataRef = useRef<{ titulo: string; descripcion: string } | null>(null);

  // Actualizar el estado solo cuando el modal se abre por primera vez
  useEffect(() => {
    if (visible && !initializedRef.current) {
      if (initialData) {
        setTitulo(initialData.titulo);
        setDescripcion(initialData.descripcion || "");
        lastInitialDataRef.current = {
          titulo: initialData.titulo,
          descripcion: initialData.descripcion || "",
        };
      } else {
        setTitulo("");
        setDescripcion("");
        lastInitialDataRef.current = null;
      }
      initializedRef.current = true;
    } else if (!visible) {
      // Reset cuando se cierra el modal
      initializedRef.current = false;
      lastInitialDataRef.current = null;
    }
  }, [visible]);

  const handleSubmit = async () => {
    // Validación básica
    if (!titulo.trim()) {
      alert(`Por favor ingresa un título para tu ${itemType}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      });
      // Limpiar formulario
      setTitulo("");
      setDescripcion("");
      onClose();
    } catch (error) {
      console.error(`Error al crear ${itemType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitulo("");
    setDescripcion("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Pressable style={styles.backdrop} onPress={handleCancel} />

        <ThemedView
          style={[
            styles.modalContent,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              {initialData ? config.editTitle : config.createTitle}
            </ThemedText>
            <Pressable onPress={handleCancel} style={styles.closeButton}>
              <X size={IconSizes.md} color={colors.icon} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Título */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Título <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder={config.titlePlaceholder}
                placeholderTextColor={colors.textMuted}
                value={titulo}
                onChangeText={setTitulo}
                maxLength={100}
                autoFocus
              />
              <ThemedText
                style={[styles.helperText, { color: colors.textMuted }]}
              >
                {titulo.length}/100 caracteres
              </ThemedText>
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: colors.text }]}>
                Descripción (opcional)
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder={config.descriptionPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              <ThemedText
                style={[styles.helperText, { color: colors.textMuted }]}
              >
                {descripcion.length}/500 caracteres
              </ThemedText>
            </View>
          </ScrollView>

          {/* Footer con botones */}
          <View style={styles.modalFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { borderColor: colors.border },
                pressed && styles.buttonPressed,
              ]}
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              <ThemedText
                style={[styles.cancelButtonText, { color: colors.text }]}
              >
                Cancelar
              </ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                { backgroundColor: BrandColors.primary },
                pressed && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting
                  ? initialData
                    ? "Guardando..."
                    : "Creando..."
                  : initialData
                  ? "Guardar cambios"
                  : `Crear ${itemType}`}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: "90%",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Header
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NeutralColors.gray200,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  closeButton: {
    padding: Spacing.xs,
  },

  // Form
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  required: {
    color: BrandColors.error,
  },
  input: {
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  textArea: {
    fontSize: FontSizes.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 100,
  },
  helperText: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },

  // Footer
  modalFooter: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NeutralColors.gray200,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  submitButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default React.memo(
  CreateItemModal,
  (prevProps, nextProps) => {
    // Comparación personalizada para evitar re-renders innecesarios
    if (prevProps.visible !== nextProps.visible) return false;
    if (prevProps.itemType !== nextProps.itemType) return false;
    if (prevProps.onClose !== nextProps.onClose) return false;
    if (prevProps.onSubmit !== nextProps.onSubmit) return false;

    // Comparar initialData por valores, no por referencia
    const prevData = prevProps.initialData;
    const nextData = nextProps.initialData;

    if (!prevData && !nextData) return true;
    if (!prevData || !nextData) return false;

    return (
      prevData.titulo === nextData.titulo &&
      prevData.descripcion === nextData.descripcion
    );
  }
);

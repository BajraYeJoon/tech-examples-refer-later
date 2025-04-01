import { useFormContext } from "react-hook-form";
import { type AirbnbFormData } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface PhotoData {
  url: string;
  caption: string;
  isPrimary: boolean;
  order: number;
}

export function PhotosStep() {
  const { control, setValue, watch } = useFormContext<AirbnbFormData>();
  const photos = watch("photos") || [];
  const [currentPhoto, setCurrentPhoto] = useState<PhotoData>({
    url: "",
    caption: "",
    isPrimary: false,
    order: photos.length,
  });

  const handlePhotoAdd = () => {
    if (currentPhoto.url && currentPhoto.caption) {
      setValue("photos", [
        ...photos,
        { ...currentPhoto, order: photos.length },
      ]);
      setCurrentPhoto({
        url: "",
        caption: "",
        isPrimary: false,
        order: photos.length + 1,
      });
    }
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = photos
      .filter((_, i) => i !== index)
      .map((photo, i) => ({
        ...photo,
        order: i,
      }));
    setValue("photos", newPhotos);
  };

  const handleSetPrimary = (index: number) => {
    const newPhotos = photos.map((photo, i) => ({
      ...photo,
      isPrimary: i === index,
    }));
    setValue("photos", newPhotos);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedPhotos = items.map((photo, index) => ({
      ...photo,
      order: index,
    }));
    setValue("photos", reorderedPhotos);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="photos"
        render={() => (
          <FormItem>
            <FormLabel>Property Photos</FormLabel>
            <FormDescription>
              Add at least 5 high-quality photos of your property. The first
              photo will be the cover image.
            </FormDescription>

            <div className="space-y-4 mt-4">
              <div className="grid gap-4">
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter photo URL"
                      value={currentPhoto.url}
                      onChange={(e) =>
                        setCurrentPhoto({
                          ...currentPhoto,
                          url: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a caption for this photo"
                      value={currentPhoto.caption}
                      onChange={(e) =>
                        setCurrentPhoto({
                          ...currentPhoto,
                          caption: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </FormItem>

                <Button
                  type="button"
                  onClick={handlePhotoAdd}
                  disabled={!currentPhoto.url || !currentPhoto.caption}
                >
                  Add Photo
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="photos">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {photos.map((photo, index) => (
                        <Draggable
                          key={photo.url}
                          draggableId={photo.url}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                            >
                              <img
                                src={photo.url}
                                alt={photo.caption}
                                className="w-24 h-24 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium">{photo.caption}</p>
                                <p className="text-sm text-muted-foreground">
                                  {photo.isPrimary
                                    ? "Cover Photo"
                                    : `Photo ${index + 1}`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetPrimary(index)}
                                  disabled={photo.isPrimary}
                                >
                                  Set as Cover
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handlePhotoRemove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

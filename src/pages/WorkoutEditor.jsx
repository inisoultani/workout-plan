import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash, GripVertical, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea as UITextarea } from "@/components/ui/textarea";
import { useWorkoutState } from "@/context/WorkoutContext";
import { useNavigate } from "react-router-dom";

// Map previous custom variants to shared Button variants via className helpers
const variantMap = {
  primary: "",
  secondary: "variant-secondary",
  success: "bg-green-600 hover:bg-green-700 text-white",
  warning: "bg-amber-500 hover:bg-amber-600 text-white",
  danger: "variant-destructive",
};
const mapVariant = (v) => (v === "danger" ? { variant: "destructive", className: "" } : v === "secondary" ? { variant: "secondary", className: "" } : { variant: "default", className: variantMap[v] || "" });
const TextArea = (props) => <UITextarea {...props} />;

function getPhaseTheme(phase) {
  const label = (phase.label || "").toLowerCase();
  const type = (phase.type || "").toLowerCase();
  if (label.includes("warm")) return { card: "bg-amber-50 border-amber-200", headerDot: "bg-amber-400" };
  if (label.includes("cool")) return { card: "bg-sky-50 border-sky-200", headerDot: "bg-sky-400" };
  if (label.includes("finish")) return { card: "bg-rose-50 border-rose-200", headerDot: "bg-rose-400" };
  if (type === "superset") return { card: "bg-violet-50 border-violet-200", headerDot: "bg-violet-400" };
  if (type === "circuit") return { card: "bg-emerald-50 border-emerald-200", headerDot: "bg-emerald-400" };
  if (label.includes("strength")) return { card: "bg-indigo-50 border-indigo-200", headerDot: "bg-indigo-400" };
  return { card: "bg-white border-slate-200", headerDot: "bg-slate-300" };
}

// Simple uid helper
const uid = () => Math.random().toString(36).slice(2, 9);

// reorder helper
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

// move between lists
function move(source, destination, sourceIdx, destIdx) {
  const src = Array.from(source);
  const dst = Array.from(destination);
  const [removed] = src.splice(sourceIdx, 1);
  dst.splice(destIdx, 0, removed);
  return { source: src, destination: dst };
}

export default function WorkoutEditor({ onSaveProgram }) {
  const state = useWorkoutState();
  const navigate = useNavigate();
  const [program, setProgram] = useState(
    state.program || {
      title: "",
      day: "",
      focus: "",
      restBetweenPhase: null,
      is_template: false,
      archived_at: null,
      phases: [],
    }
  );
  // const [editing, setEditing] = useState({}); // map of itemId -> boolean for inline editing
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.program) setProgram(state.program);
  }, [state.program]);

  // Phase CRUD
  function addPhase() {
    const p = {
      id: uid(),
      label: "New Phase",
      type: "linear",
      restBetweenExercise: null,
      restBetweenSets: null,
      rounds: null,
      restBetweenRounds: null,
      position: program.phases.length,
      exercises: [],
      groups: [],
    };
    setProgram((prev) => ({ ...prev, phases: [...prev.phases, p] }));
  }
  function updatePhase(phaseId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, ...patch } : ph)),
    }));
  }
  function deletePhase(phaseId) {
    setProgram((prev) => ({ ...prev, phases: prev.phases.filter((p) => p.id !== phaseId) }));
  }

  // Group CRUD
  function addGroup(phaseId) {
    const phase = program.phases.find((p) => p.id === phaseId);
    if (!phase || (phase.type && phase.type !== "superset")) {
      return;
    }
    const g = {
      id: uid(),
      name: "New Group",
      sets: 3,
      restBetweenSets: null,
      restBetweenExercise: null,
      position: 0,
      exercises: [],
    };
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, groups: [...ph.groups, { ...g, position: ph.groups.length }] } : ph)),
    }));
  }
  function updateGroup(phaseId, groupId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? { ...ph, groups: ph.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) }
          : ph
      ),
    }));
  }
  function deleteGroup(phaseId, groupId) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => (ph.id === phaseId ? { ...ph, groups: ph.groups.filter((g) => g.id !== groupId) } : ph)),
    }));
  }

  // Exercise CRUD
  function addExercise(phaseId, groupId) {
    const ex = {
      id: uid(),
      name: "New Exercise",
      duration: null,
      notes: "",
      position: 0,
    };
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) => (g.id === groupId ? { ...g, exercises: [...g.exercises, { ...ex, position: g.exercises.length }] } : g))
                : ph.groups,
              exercises: !groupId ? [...(ph.exercises || []), { ...ex, position: (ph.exercises || []).length }] : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }
  function updateExercise(phaseId, groupId, exerciseId, patch) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) =>
                    g.id === groupId ? { ...g, exercises: g.exercises.map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)) } : g
                  )
                : ph.groups,
              exercises: !groupId ? (ph.exercises || []).map((e) => (e.id === exerciseId ? { ...e, ...patch } : e)) : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }
  function deleteExercise(phaseId, groupId, exerciseId) {
    setProgram((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) =>
        ph.id === phaseId
          ? {
              ...ph,
              groups: groupId
                ? ph.groups.map((g) => (g.id === groupId ? { ...g, exercises: g.exercises.filter((e) => e.id !== exerciseId) } : g))
                : ph.groups,
              exercises: !groupId ? (ph.exercises || []).filter((e) => e.id !== exerciseId) : (ph.exercises || []),
            }
          : ph
      ),
    }));
  }

  // Drag end handling
  function onDragEnd(result) {
    const { source, destination, type } = result;
    if (!destination) return;

    // reorder phases
    if (type === "PHASE") {
      const reordered = reorder(program.phases, source.index, destination.index).map((p, i) => ({ ...p, position: i }));
      setProgram((prev) => ({ ...prev, phases: reordered }));
      return;
    }

    // group dragging: droppableId like `groups-<phaseId>`
    if (type === "GROUP") {
      const srcPhaseId = source.droppableId.split("groups-")[1];
      const dstPhaseId = destination.droppableId.split("groups-")[1];
      const srcPhase = program.phases.find((p) => p.id === srcPhaseId);
      const dstPhase = program.phases.find((p) => p.id === dstPhaseId);
      if (!srcPhase || !dstPhase) return;

      if (srcPhaseId === dstPhaseId) {
        const newGroups = reorder(srcPhase.groups, source.index, destination.index).map((g, i) => ({ ...g, position: i }));
        updatePhase(srcPhaseId, { groups: newGroups });
      } else {
        const res = move(srcPhase.groups, dstPhase.groups, source.index, destination.index);
        const updatedPhases = program.phases.map((ph) => {
          if (ph.id === srcPhaseId) return { ...ph, groups: res.source.map((g, i) => ({ ...g, position: i })) };
          if (ph.id === dstPhaseId) return { ...ph, groups: res.destination.map((g, i) => ({ ...g, position: i })) };
          return ph;
        });
        setProgram((prev) => ({ ...prev, phases: updatedPhases }));
      }
      return;
    }

    // exercise dragging: droppableId like `ex|<phaseId>|<groupId>`
    if (type === "EXERCISE") {
      const [_, srcPhaseId, srcGroupId] = source.droppableId.split("|");
      const [__, dstPhaseId, dstGroupId] = destination.droppableId.split("|");

      const srcPhase = program.phases.find((p) => p.id === srcPhaseId);
      const dstPhase = program.phases.find((p) => p.id === dstPhaseId);
      if (!srcPhase || !dstPhase) return;
      const srcGroup = srcPhase.groups.find((g) => g.id === srcGroupId);
      const dstGroup = dstPhase.groups.find((g) => g.id === dstGroupId);
      if (!srcGroup || !dstGroup) return;

      if (srcGroupId === dstGroupId && srcPhaseId === dstPhaseId) {
        const newExercises = reorder(srcGroup.exercises, source.index, destination.index).map((e, i) => ({ ...e, position: i }));
        updateGroup(srcPhaseId, srcGroupId, { exercises: newExercises });
      } else {
        const res = move(srcGroup.exercises, dstGroup.exercises, source.index, destination.index);
        const updatedPhases = program.phases.map((ph) => {
          if (ph.id === srcPhaseId) return { ...ph, groups: ph.groups.map((g) => (g.id === srcGroupId ? { ...g, exercises: res.source.map((e, i) => ({ ...e, position: i })) } : g)) };
          if (ph.id === dstPhaseId) return { ...ph, groups: ph.groups.map((g) => (g.id === dstGroupId ? { ...g, exercises: res.destination.map((e, i) => ({ ...e, position: i })) } : g)) };
          return ph;
        });
        setProgram((prev) => ({ ...prev, phases: updatedPhases }));
      }
      return;
    }

    // phase-level exercise dragging: droppableId like `pex|<phaseId>`
    if (type === "PEXERCISE") {
      const srcPhaseId = source.droppableId.split("pex|")[1];
      const dstPhaseId = destination.droppableId.split("pex|")[1];
      if (!srcPhaseId || !dstPhaseId || srcPhaseId !== dstPhaseId) return;
      const phase = program.phases.find((p) => p.id === srcPhaseId);
      if (!phase) return;
      const newExercises = reorder(phase.exercises || [], source.index, destination.index).map((e, i) => ({ ...e, position: i }));
      updatePhase(srcPhaseId, { exercises: newExercises });
      return;
    }
  }

  async function saveProgram() {
    setIsSaving(true);
    try {
      if (onSaveProgram) await onSaveProgram(program);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mb-4 space-y-3">
      <div className="flex items-center gap-3">
          <Button onClick={() => {navigate('/')}} className="md:col-span-1"><ArrowLeft /> Back</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Program Title" value={program.title} onChange={(e) => setProgram({ ...program, title: e.target.value })} className="md:col-span-2" />
          <Input placeholder="Day (e.g. Monday)" value={program.day} onChange={(e) => setProgram({ ...program, day: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            RBP
            <Input type="number" value={program.restBetweenPhase ?? ""} onChange={(e) => setProgram({ ...program, restBetweenPhase: e.target.value ? Number(e.target.value) : null })} className="w-28" />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <Input placeholder="Focus (short description)" value={program.focus || ""} onChange={(e) => setProgram({ ...program, focus: e.target.value })} className="md:col-span-3" />
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={!!program.is_template} onChange={(e) => setProgram({ ...program, is_template: e.target.checked })} />
            Template
          </label>
        </div>
        <div className="flex items-center gap-3">
          {(() => { const { variant, className } = mapVariant('primary'); return <Button onClick={addPhase} variant={variant} className={className}><Plus /> Add Phase</Button>; })()}
          {(() => { const { variant, className } = mapVariant('success'); return <Button onClick={saveProgram} variant={variant} className={className} disabled={isSaving}><Save /> {isSaving ? 'Saving...' : 'Save'}</Button>; })()}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-phases" type="PHASE">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {program.phases.map((phase, phaseIndex) => (
                <Draggable key={phase.id} draggableId={phase.id} index={phaseIndex}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`border rounded-md p-3 shadow-sm ${getPhaseTheme(phase).card} text-slate-900`}
                    >
                      <div className="flex items-start gap-3">
                        <div {...prov.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">#{phaseIndex + 1}</span>
                              <Input value={phase.label} onChange={(e) => updatePhase(phase.id, { label: e.target.value })} className="font-semibold text-lg" />
                              <select value={phase.type} onChange={(e) => updatePhase(phase.id, { type: e.target.value })} className="border rounded px-2 py-1 text-sm">
                                <option value="linear">Linear</option>
                                <option value="superset">Superset</option>
                                <option value="circuit">Circuit</option>
                              </select>
                              <div className={`inline-flex items-center gap-2 text-xs px-2 py-0.5 rounded-full bg-white/70 text-slate-700 border ${getPhaseTheme(phase).card.split(' ').find(c=>c.startsWith('border-'))}`}>
                                <span className={`w-2 h-2 rounded-full ${getPhaseTheme(phase).headerDot}`}></span>
                                {phase.type}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {phase.type === 'superset' && (() => { const { variant, className } = mapVariant('warning'); return <Button variant={variant} className={className} onClick={() => addGroup(phase.id)}><Plus /> Group</Button>; })()}
                              {phase.type !== 'superset' && (() => { const { variant, className } = mapVariant('primary'); return <Button variant={variant} className={className} onClick={() => addExercise(phase.id)}><Plus /> Add Exercise</Button>; })()}
                              {(() => { const { variant, className } = mapVariant('danger'); return <Button variant={variant} className={className} onClick={() => deletePhase(phase.id)}><Trash /></Button>; })()}
                            </div>
                          </div>

                          {/* Phase attributes */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-slate-300">
                            <label className="flex items-center gap-2">RBE
                              <Input
                                type="number"
                                value={phase.restBetweenExercise ?? ""}
                                onChange={(e) => updatePhase(phase.id, { restBetweenExercise: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">RBS
                              <Input
                                type="number"
                                value={phase.restBetweenSets ?? ""}
                                onChange={(e) => updatePhase(phase.id, { restBetweenSets: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">Rounds
                              <Input
                                type="number"
                                value={phase.rounds ?? ""}
                                onChange={(e) => updatePhase(phase.id, { rounds: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                            <label className="flex items-center gap-2">RBR
                              <Input
                                type="number"
                                value={phase.restBetweenRounds ?? ""}
                                onChange={(e) => updatePhase(phase.id, { restBetweenRounds: e.target.value ? Number(e.target.value) : null })}
                                className="w-24"
                              />
                            </label>
                          </div>

                          <div className="mt-3">
                            {phase.type === 'superset' ? (
                              <Droppable droppableId={`groups-${phase.id}`} type="GROUP">
                                {(provGroups) => (
                                  <div ref={provGroups.innerRef} {...provGroups.droppableProps} className="space-y-2">
                                    {phase.groups.map((group, groupIndex) => (
                                      <Draggable key={group.id} draggableId={group.id} index={groupIndex}>
                                        {(provGroup) => (
                                          <div ref={provGroup.innerRef} {...provGroup.draggableProps} className="border border-slate-200 rounded p-2 bg-white/80 text-slate-900">
                                            <div className="flex items-center gap-2">
                                              <div {...provGroup.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs font-semibold text-slate-500">#{groupIndex + 1}</span>
                                                  <Input value={group.name} onChange={(e) => updateGroup(phase.id, group.id, { name: e.target.value })} />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-xs mt-1 text-slate-600">
                                                  <div>Sets: <Input value={group.sets} onChange={(e) => updateGroup(phase.id, group.id, { sets: Number(e.target.value) })} className="inline w-20" /></div>
                                                  <div>RBS: <Input value={group.restBetweenSets ?? ""} onChange={(e) => updateGroup(phase.id, group.id, { restBetweenSets: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                  <div>RBE: <Input value={group.restBetweenExercise ?? ""} onChange={(e) => updateGroup(phase.id, group.id, { restBetweenExercise: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {(() => { const { variant, className } = mapVariant('primary'); return <Button variant={variant} className={className} onClick={() => addExercise(phase.id, group.id)}><Plus /> Add Exercise</Button>; })()}
                                                {(() => { const { variant, className } = mapVariant('danger'); return <Button variant={variant} className={className} onClick={() => deleteGroup(phase.id, group.id)}><Trash /></Button>; })()}
                                              </div>
                                            </div>

                                            <div className="mt-2">
                                              <Droppable droppableId={`ex|${phase.id}|${group.id}`} type="EXERCISE">
                                                {(provEx) => (
                                                  <div ref={provEx.innerRef} {...provEx.droppableProps} className="space-y-1">
                                                    {group.exercises.map((ex, exIndex) => (
                                                      <Draggable key={ex.id} draggableId={ex.id} index={exIndex}>
                                                        {(provExItem) => (
                                                          <div
                                                            ref={provExItem.innerRef}
                                                            {...provExItem.draggableProps}
                                                            className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-900"
                                                          >
                                                            <div {...provExItem.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                                            <div className="flex-1">
                                                              <div className="flex items-center gap-2">
                                                                <span className="text-xs font-semibold text-slate-500">#{exIndex + 1}</span>
                                                                <Input value={ex.name} onChange={(e) => updateExercise(phase.id, group.id, ex.id, { name: e.target.value })} />
                                                              </div>
                                                              <div className="text-xs mt-1 text-slate-600">Duration: <Input value={ex.duration || ""} onChange={(e) => updateExercise(phase.id, group.id, ex.id, { duration: e.target.value ? Number(e.target.value) : null })} className="inline w-20" /></div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                              {(() => { const { variant, className } = mapVariant('danger'); return <Button onClick={() => deleteExercise(phase.id, group.id, ex.id)} variant={variant} className={className}><Trash /></Button>; })()}
                                                            </div>
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    ))}
                                                    {provEx.placeholder}
                                                  </div>
                                                )}
                                              </Droppable>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provGroups.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ) : (
                              <Droppable droppableId={`pex|${phase.id}`} type="PEXERCISE">
                                {(provExPhase) => (
                                  <div ref={provExPhase.innerRef} {...provExPhase.droppableProps} className="space-y-2">
                                    {(phase.exercises || []).map((ex, exIndex) => (
                                      <Draggable key={ex.id} draggableId={ex.id} index={exIndex}>
                                        {(provExItem) => (
                                          <div
                                            ref={provExItem.innerRef}
                                            {...provExItem.draggableProps}
                                            className="flex items-start gap-2 p-2 bg-white rounded border border-slate-200 hover:bg-slate-50 transition text-slate-900"
                                          >
                                            <div {...provExItem.dragHandleProps} className="p-1 cursor-grab"><GripVertical /></div>
                                            <div className="flex-1 space-y-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-500">#{exIndex + 1}</span>
                                                <Input value={ex.name} onChange={(e) => updateExercise(phase.id, null, ex.id, { name: e.target.value })} />
                                              </div>
                                              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                                <div>Duration: <Input value={ex.duration || ""} onChange={(e) => updateExercise(phase.id, null, ex.id, { duration: e.target.value ? Number(e.target.value) : null })} className="inline w-24" /></div>
                                                <div className="col-span-2 sm:col-span-1 w-full">Notes:</div>
                                              </div>
                                              <TextArea value={ex.notes || ""} onChange={(e) => updateExercise(phase.id, null, ex.id, { notes: e.target.value })} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {(() => { const { variant, className } = mapVariant('danger'); return <Button onClick={() => deleteExercise(phase.id, null, ex.id)} variant={variant} className={className}><Trash /></Button>; })()}
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provExPhase.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        </div>
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
  );
}

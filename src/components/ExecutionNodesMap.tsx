import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { EXECUTION_NODES } from '../data/executionNodes';
import { ExecutionNode } from '../types';
import { Server, Activity, Zap, ShieldCheck, Globe, Wifi, CheckCircle2, ArrowRight } from 'lucide-react';

interface ExecutionNodesMapProps {
  onSelectNode?: (node: ExecutionNode) => void;
}

export const ExecutionNodesMap: React.FC<ExecutionNodesMapProps> = ({ onSelectNode }) => {
  const [selectedNode, setSelectedNode] = useState<ExecutionNode | null>(EXECUTION_NODES[0]);
  const [activeBrokerTest, setActiveBrokerTest] = useState<string>('Tickmill ECN (LD4)');
  const [testingPing, setTestingPing] = useState<boolean>(false);
  const [testedLatency, setTestedLatency] = useState<number | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const handleTestLatency = (brokerName: string) => {
    setActiveBrokerTest(brokerName);
    setTestingPing(true);
    setTestedLatency(null);

    setTimeout(() => {
      // Simulate realistic ultra-low latency response based on node
      const base = selectedNode ? selectedNode.pingMs : 1.0;
      const variance = (Math.random() * 0.4 - 0.2);
      const result = Math.max(0.4, Number((base + variance).toFixed(2)));
      setTestedLatency(result);
      setTestingPing(false);
    }, 450);
  };

  return (
    <div className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="p-5 md:p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
              Global HFT Co-Location Network
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              99.99% Uptime
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            Microsecond Execution Infrastructure
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Our algorithms are physically co-located inside the same Equinix data centers as Tier-1 investment banks and institutional liquidity providers.
          </p>
        </div>

        {/* Global summary pills */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2 text-right">
            <div className="text-[11px] text-slate-400 font-mono">Global Nodes</div>
            <div className="text-lg font-bold text-white font-mono">{EXECUTION_NODES.length} Tier-4 Hubs</div>
          </div>
          <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl px-3.5 py-2 text-right">
            <div className="text-[11px] text-emerald-400 font-mono">Min Latency</div>
            <div className="text-lg font-bold text-emerald-300 font-mono">0.7 ms</div>
          </div>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Interactive Google Map */}
        <div className="lg:col-span-8 relative min-h-[420px] lg:min-h-[560px] bg-slate-950">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <div className="w-full h-full min-h-[420px] lg:min-h-[560px]">
                <Map
                  id="trading-execution-network-map"
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={{ lat: 42.0, lng: 18.0 }}
                  defaultZoom={3}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                >
                  {EXECUTION_NODES.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <AdvancedMarker
                        key={node.id}
                        position={{ lat: node.lat, lng: node.lng }}
                        title={`${node.name} - ${node.pingMs}ms`}
                        onClick={() => {
                          setSelectedNode(node);
                          if (onSelectNode) onSelectNode(node);
                        }}
                      >
                        {/* Custom Glowing Quant Radar Pin */}
                        <div className="relative group cursor-pointer flex flex-col items-center">
                          {isSelected && (
                            <div className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-ping-slow pointer-events-none" />
                          )}
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-lg transition-all duration-200 border ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950 border-white scale-110 shadow-cyan-500/50'
                                : 'bg-slate-900/95 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-white'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-slate-950 animate-pulse' : 'bg-emerald-400'
                              }`}
                            />
                            <span>{node.city}</span>
                            <span
                              className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                                isSelected ? 'bg-slate-900 text-cyan-300' : 'bg-slate-800 text-emerald-400'
                              }`}
                            >
                              {node.pingMs}ms
                            </span>
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {selectedNode && (
                    <InfoWindow
                      position={{ lat: selectedNode.lat, lng: selectedNode.lng }}
                      onCloseClick={() => setSelectedNode(null)}
                      headerContent={
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          <Server className="w-3.5 h-3.5 text-cyan-600" />
                          {selectedNode.name}
                        </div>
                      }
                    >
                      <div className="text-xs text-slate-700 space-y-1 py-1 max-w-[200px]">
                        <p className="font-semibold text-slate-900">{selectedNode.datacenter}</p>
                        <p className="text-emerald-700 font-mono font-bold">Avg latency: {selectedNode.pingMs} ms</p>
                        <p className="text-slate-600">{selectedNode.bandwidth}</p>
                        <div className="pt-1 text-[11px] text-cyan-800 font-medium">
                          {selectedNode.activeBots} active bots connected
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>
            </APIProvider>
          ) : (
            <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-8 bg-slate-900/80 text-center">
              <Globe className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
              <h4 className="text-lg font-bold text-white mb-1">Global Execution Network Map</h4>
              <p className="text-sm text-slate-400 max-w-md mb-4">
                Infrastructure connected in real time with Equinix LD4 (London), NY4 (New York), and FR2 (Frankfurt) data centers.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
                {EXECUTION_NODES.slice(0, 6).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedNode?.id === node.id
                        ? 'bg-cyan-950/80 border-cyan-400 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{node.city}</div>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold">{node.pingMs} ms</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Node selector overlay on mobile & bottom of map */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2 overflow-x-auto pb-1 scrollbar-none pointer-events-auto">
            {EXECUTION_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border backdrop-blur-md flex items-center gap-1.5 ${
                  selectedNode?.id === node.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{node.city}</span>
                <span className="font-mono text-[11px] opacity-80">{node.pingMs}ms</span>
              </button>
            ))}
          </div>
        </div>

        {/* Node Specs & Real-Time Broker Ping Simulator */}
        <div className="lg:col-span-4 p-5 md:p-6 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Selected Co-Location Node
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedNode.status}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mt-1">{selectedNode.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedNode.datacenter}, {selectedNode.country}</p>
              </div>

              {/* Node Metrics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Matching Latency
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                    {selectedNode.pingMs} ms
                  </div>
                  <div className="text-[10px] text-slate-500">To Tier-1 liquidity</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Active Bots
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedNode.activeBots}
                  </div>
                  <div className="text-[10px] text-slate-500">Synchronized instances</div>
                </div>
              </div>

              {/* Hardware specifications */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs space-y-1.5">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Dedicated Server Specs:
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {selectedNode.specs}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  Bandwidth: <span className="text-slate-200 font-mono font-medium">{selectedNode.bandwidth}</span>
                </div>
              </div>

              {/* Live Broker Ping Test Tool */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                  <span>Test Your Broker Latency:</span>
                  <span className="text-[11px] font-mono text-cyan-400">Real-Time Ping</span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {selectedNode.targetBrokers.slice(0, 4).map((broker) => (
                    <button
                      key={broker}
                      onClick={() => handleTestLatency(broker)}
                      className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between border transition-all ${
                        activeBrokerTest === broker
                          ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-semibold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {broker}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {activeBrokerTest === broker && testedLatency !== null
                          ? `${testedLatency} ms`
                          : testingPing && activeBrokerTest === broker
                          ? 'Measuring...'
                          : 'Test'}
                      </span>
                    </button>
                  ))}
                </div>

                {testedLatency !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">Confirmed Latency: </span>
                      <span className="font-mono font-bold text-white text-sm">{testedLatency} ms</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">
                      HFT Ideal
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              Select a node on the map to inspect co-location specifications.
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Free VPS hosting included with Pro & VIP Lifetime plans
            </div>
            <a
              href="#preturi"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Activate Co-Location Connection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
